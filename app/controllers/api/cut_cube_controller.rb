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
    cut_cube = current_user.cut_cubes.find_by(id: params[:id]) # IDで切断データを取得
    if cut_cube
      cut_cube = {
        glb_url: url_for(cut_cube.gltf_file),
        cut_points: JSON.parse(cut_cube.cut_points),
        title: cut_cube.title,
        memo: cut_cube.memo,
        created_at: cut_cube.created_at
      }
      render json: { cut_cube: cut_cube }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def index
    cut_cubes = current_user.cut_cubes.all.order(created_at: :desc)
  
    if cut_cubes.any?
      cut_cubes = {
        ids: cut_cubes.map { |cut_cube| cut_cube.id },
        glb_urls: cut_cubes.map { |cut_cube| url_for(cut_cube.gltf_file)},
        cut_points: cut_cubes.map { |cut_cube| JSON.parse(cut_cube.cut_points)},
        titles: cut_cubes.map { |cut_cube| cut_cube.title },
        memos: cut_cubes.map { |cut_cube| cut_cube.memo },
        created_at: cut_cubes.map { |cut_cube| cut_cube.created_at }
      }
      render json: { cut_cubes: cut_cubes }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def destroy
    cut_cube = current_user.cut_cubes.find_by(id: params[:id])
    if cut_cube
      cut_cube.destroy
      cut_cube.gltf_file.purge
      render json: { status: "success", message: 'CutCube deleted successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def update
    cut_cube = current_user.cut_cubes.find_by(id: params[:id])
    if cut_cube
      cut_cube.update(title: params[:title], memo: params[:memo])
      render json: { status: "success", message: 'CutCube updated successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end
end
