class Api::BoardsController < ApplicationController
  def create
    board = current_user.boards.new(board_params)
    if board.save
      board.create_tags_by_names(params[:tags])
      render json: { message: "Board作成完了", board_id: board.id }, status: :ok
    else
      render json: { message: "登録に失敗しました", errors: board.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def my_boards_index
    boards = current_user.boards
      .with_associations
      .order(created_at: :desc)
    
    boards_data =
      {
        board_ids: boards.map(&:id),
        cut_points: boards.map(&:cut_points_json),
        questions: boards.map(&:question),
        created_at: boards.map(&:created_at),
        published: boards.map(&:published),
        tags: boards.map(&:tag_names)
      }
    render json: { boards: boards_data }, status: :ok
  end

  def index
    boards = Board.is_published.with_associations.order(created_at: :desc)
    
    if params[:tag_id].present?
      boards = Board.is_published.with_tag(params[:tag_id])
    elsif params[:filter].present?
      if params[:filter] == "tag"
        boards = boards.joins(board_tags: :tag)
      elsif params[:filter] == "popular"
        boards = Board.is_published.popular
      elsif params[:filter] == "like"
        boards = current_user.liked_boards.is_published
      elsif params[:filter] == "favorite"
        boards = current_user.favorited_boards.is_published
      end
    end

    boards_data =
      {
        user_names: boards.map(&:user_name),
        board_ids: boards.map(&:id),
        cut_points: boards.map(&:cut_points_json),
        questions: boards.map(&:question),
        created_at: boards.map(&:created_at),
        tags: boards.map(&:tag_names),
        likes: boards.map { |board| board.liked_by?(current_user) },
        like_counts: boards.map{ |board| board.likes.count },
        favorites: boards.map { |board| board.favorited_by?(current_user)}
      }
      
    render json: { boards: boards_data }, status: :ok
  end

  # 公開Boardの情報を取得
  def show
    board = Board.with_associations.find_by(id: params[:id])

    if board.present?
      board_data = {
        user_name: board.user.name,
        glb_url: url_for(board.cut_cube.gltf_file),
        cut_points: board.cut_points_json,
        question: board.question,
        answer: board.answer,
        explanation: board.explanation,
        created_at: board.created_at,
        is_owner: board.user_id == current_user.id,
        published: board.published,
        tags: board.tag_names,
        like: board.liked_by?(current_user),
        like_count: board.likes.count,
        favorite: board.favorited_by?(current_user)
      }
      render json: { board: board_data}, status: :ok
    end
  end

  def update
    board = current_user.boards.find_by(id: params[:id])

    if board.nil?
      return render json: { error: 'Board not found' }, status: :not_found
    end

    if board.update(board_update_params)
      board.update_tags_by_name(params[:tags]) if params[:tags].present?
      render json: { status: "success", message: 'Board updated successfully' }, status: :ok
    else
      render json: { error: 'Failed to update board' }, status: :not_found
    end
  end

  def destroy
    board = current_user.boards.find_by(id: params[:id])

    if board.present?
      board.destroy
      render json: { status: "success", message: 'Board deleted successfully' }, status: :ok
    else
      render json: { error: 'Board not found' }, status: :not_found
    end
  end
      
  private

  def board_params
    params.require(:board).permit(:cut_cube_id, :question, :answer, :explanation, :published)
  end

  def board_update_params
    params.require(:board).permit(:question, :answer, :explanation, :published)
  end
end