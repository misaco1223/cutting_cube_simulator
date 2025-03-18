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

      render_cut_cube = {
        id: cut_cube.id,
        glb_url: url_for(cut_cube.gltf_file),
        cut_points: JSON.parse(cut_cube.cut_points),
        title: cut_cube.title,
        memo: cut_cube.memo,
        created_at: cut_cube.created_at
      }

      render json: { status: "success", cut_cube: render_cut_cube }, status: :ok
    else
      render json: { status: "error", message: "切断失敗" }, status: :unprocessable_entity
    end
  end

  def show
    cut_cube = if current_user.present? 
                 current_user.cut_cubes.find_by(id: params[:id])
               else CutCube.find_by(id: params[:id])
               end

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
    cut_cubes = if current_user.present?
      current_user.cut_cubes.order(created_at: :desc)
    elsif cookies[:guest_id].present?
      CutCube.where(cookie_id: cookies[:guest_id]).order(created_at: :desc)
    end
  
    if cut_cubes.present?
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
    cut_cube = if current_user.present?
      current_user.cut_cubes.find_by(id: params[:id])
    else
      CutCube.find_by(id: params[:id])
    end

    if cut_cube
      cut_cube.destroy
      cut_cube.gltf_file.purge
      render json: { status: "success", message: 'CutCube deleted successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def update
    cut_cube = if current_user.present?
      current_user.cut_cubes.find_by(id: params[:id])
    else
      CutCube.find_by(id: params[:id])
    end

    if cut_cube
      cut_cube.update(title: params[:title], memo: params[:memo])
      render json: { status: "success", message: 'CutCube updated successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end
end
