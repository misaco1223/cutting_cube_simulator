require 'open3'
class Api::CutCubesController < ApplicationController

  def create
    cut_id = params[:id]
    cut_points = params[:points]
    cookie_id = cookies[:guest_id]
    puts "cookies[:guest_id]は: #{cookies[:guest_id]}"

    if cut_id.present? && cut_points.present?
      cut_data = { id: cut_id, points: cut_points}.to_json
      # puts `which blender`
      # command = `blender -b -P #{Rails.root.join('lib/python_scripts/main.py')} -- '#{cut_data}'`
      # result = `docker-compose run --rm blender blender -b -P /scripts/main.py -- '#{cut_data}'`
      # result = `docker exec blender blender -b -P /scripts/main.py -- '#{cut_data}'`
      # puts "Blender実行結果: #{result}"

      # script_path = Rails.root.join('lib/python_scripts/main.py').to_s
      # puts "script_path: #{script_path}"
      command = "blender -b -P /app/lib/python_scripts/main.py -- '#{cut_data}'"
      stdout, stderr, status = Open3.capture3(command)
      puts "Blender標準出力: #{stdout}"
      puts "Blenderエラー出力: #{stderr}"

      if status.success?
        puts "Blenderスクリプトは正常に実行されました"
      else
         puts "Blenderスクリプトにエラーがあります"
      end

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
    cut_cube = CutCube.find_by(id:params[:id])

    if cut_cube.nil?
      render json: { error: 'CutCube not found' }, status: :not_found
    end

    cut_cube_data = {
      glb_url: url_for(cut_cube.gltf_file),
      cut_points: JSON.parse(cut_cube.cut_points),
      title: cut_cube.title,
      memo: cut_cube.memo,
      created_at: cut_cube.created_at
    }

    bookmark_id = cut_cube.bookmark_id_for(current_user)

    render json: { cut_cube: cut_cube_data, bookmark_id: bookmark_id }, status: :ok
  end

  def index
    cut_cubes = CutCube.owned_by_user_or_cookie(current_user, cookies[:guest_id])
  
    if cut_cubes.present?
      cut_cubes_data = {
        ids: cut_cubes.map(&:id),
        glb_urls: cut_cubes.map { |cut_cube| url_for(cut_cube.gltf_file)},
        cut_points: cut_cubes.map { |cut_cube| JSON.parse(cut_cube.cut_points)},
        titles: cut_cubes.map(&:title),
        memos: cut_cubes.map(&:memo),
        created_at: cut_cubes.map(&:created_at)
    }

    bookmark_ids = cut_cubes.map { |cut_cube| cut_cube.bookmark_id_for(current_user) }
    render json: { cut_cubes: cut_cubes_data, bookmark_ids: bookmark_ids }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def destroy
    cut_cube = CutCube.find_by_user_or_cookie(current_user, cookies[:guest_id], params[:id])
    if cut_cube
      cut_cube.destroy
      cut_cube.gltf_file.purge
      render json: { status: "success", message: 'CutCube deleted successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  def update
    cut_cube = CutCube.find_by_user_or_cookie(current_user, cookies[:guest_id], params[:id])
    if cut_cube
      cut_cube.update(cut_cube_update_params)
      render json: { status: "success", message: 'CutCube updated successfully' }, status: :ok
    else
      render json: { error: 'CutCube not found' }, status: :not_found
    end
  end

  private

  def cut_cube_update_params
    params.require(:cut_cube).permit(:title, :memo)
  end
end
