class Api::BookmarksController < ApplicationController
    def create
      bookmark = current_user.bookmarks.new(bookmark_params)
      if bookmark.save
        render json: { message: "ブックマーク登録完了", bookmark_id: bookmark.id }, status: :ok
      else
        render json: { message: "登録に失敗しました", errors: bookmark.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      bookmarks = current_user.bookmarks
        .joins(:cut_cube)
        .order('cut_cubes.created_at DESC')

      bookmarks_data = 
        {
        bookmark_ids: bookmarks.map(&:id),
        cut_cube_ids: bookmarks.map(&:cut_cube_id),
        glb_urls: bookmarks.map { |bookmark| url_for(bookmark.cut_cube.gltf_file)},
        cut_points: bookmarks.map { |bookmark| JSON.parse(bookmark.cut_cube.cut_points)},
        created_at: bookmarks.map(&:created_at),
        titles: bookmarks.map(&:title),
        memos: bookmarks.map(&:memo)
        }
      render json: { bookmarks: bookmarks_data }, status: :ok
    end

    def destroy
      bookmark = current_user.bookmarks.find(params[:id])
      if bookmark
        bookmark.destroy
        render json: { status: "success", message: 'ブックマークを削除しました' }, status: :ok
      else
        render json: { message: "ブックマークが見つかりません" }, status: :not_found
      end
    end
      
    private

    def bookmark_params
      params.require(:bookmark).permit(:cut_cube_id)
    end
  end