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

      glb_file_name = "exported_cube_#{cut_id}.glb"
      shared_glb_url = Rails.root.join('shared', glb_file_name)
      puts "GLBファイルの保存先であるshared_glb_urlは: #{shared_glb_url}"

      user_id = current_user&.id

      cut_cube = CutCube.new(
        user_id: user_id,
        cookie_id: cookie_id,
        cut_id: cut_id,
        cut_points: cut_points,
        glb_file_name: glb_file_name
      )
      cut_cube.gltf_file.attach(io: File.open(shared_glb_url), filename: glb_file_name)
      cut_cube.save!

      File.delete(shared_glb_url) if File.exist?(shared_glb_url)
      puts "GLBファイル削除済み: #{shared_glb_url}"

      render json: { status: "success", cut_cube_id: cut_cube.id }, status: :ok
    else
      render json: { status: "error", message: "切断失敗" }, status: :unprocessable_entity
    end
  end

  def show
    cut_cube = CutCube.find_by(id: params[:id]) # IDで切断データを取得
    if cut_cube
      cut_points = JSON.parse(cut_cube.cut_points)
      render json: { glb_url: url_for(cut_cube.gltf_file), cut_points: cut_points}, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end
end
