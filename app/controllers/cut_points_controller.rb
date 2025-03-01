class CutPointsController < ApplicationController
  protect_from_forgery with: :null_session #CRSFトークン攻撃を予防

  def create
    cut_points = params[:cutPoints].to_json

    if cut_points.present?
      result = `blender -b -P #{Rails.root.join('lib/python_scripts/main.py')} -- '#{cut_points}'`
      puts "Blender実行結果: #{result}"
  
      render json: { status: "success", formatted_points: cut_points }
    else
      render json: { status: "error", message: "Railsで受け取ることができませんでした。" }, status: :unprocessable_entity
    end
  end
end
