class CutPointsController < ApplicationController
  protect_from_forgery with: :null_session #CRSFトークン攻撃を予防

  def create
    cut_points = params[:cutPoints]

    if cut_points.present?
      formatted_points = [
        cut_points[0],
        cut_points[1],
        cut_points[2]
    ]
  
      render json: { status: "success", formatted_points: formatted_points }
    else
      render json: { status: "error", message: "Railsで受け取ることができませんでした。" }, status: :unprocessable_entity
    end
  end
end
