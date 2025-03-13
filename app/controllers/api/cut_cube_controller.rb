class Api::CutCubeController < ApplicationController

  def create
    cut_id = params[:id]
    cut_points = params[:points]
    cookie_id = cookies[:guest_id]
    puts "cookies[:guest_id]は: #{cookies[:guest_id]}"

    if cut_id.present? && cut_points.present?
      cut_data = { id: cut_id, points: cut_points}.to_json
      result = `blender -b -P #{Rails.root.join('lib/python_scripts/main.py')} -- '#{cut_data}'`
      puts "Blender実行結果: #{result}"

      render json: { status: "success", formatted_points: cut_data }
    else
      render json: { status: "error", message: "Railsで受け取ることができませんでした。" }, status: :unprocessable_entity
    end
  end
end
