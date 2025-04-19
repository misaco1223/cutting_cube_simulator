class Api::LikesController < ApplicationController
  def toggle
    like = current_user.likes.find_by(board_id: params[:board_id])
    if like
      like.destroy
      message = "いいねを解除しました"
    else
      current_user.likes.create(board_id: params[:board_id])
      message = "いいねを追加しました"
    end
    
    render json: { message: message, like: like.present? }, status: :ok
  end    
end