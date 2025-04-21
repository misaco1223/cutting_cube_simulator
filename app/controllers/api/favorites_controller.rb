class Api::FavoritesController < ApplicationController
  def toggle
    favorite = current_user.favorites.find_by(board_id: params[:board_id])
    if favorite
      favorite.destroy
      message = "お気に入りを解除しました"
    else
      current_user.favorites.create(board_id: params[:board_id])
      message = "お気に入りに追加しました"
    end

    render json: { message: message, favorite: favorite.present? }, status: :ok
  end
end
