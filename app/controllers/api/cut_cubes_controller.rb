require "open3"
class Api::CutCubesController < ApplicationController
  def create
    cut_id = params[:id]

    unless cut_id&.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/)
      render json: { error: "Invalid UUID format" }, status: :bad_request and return
    end

    cut_points = params[:points]
    cookie_id = cookies[:guest_id]
    puts "cookies[:guest_id]は: #{cookies[:guest_id]}"

    if cut_id.present? && cut_points.present?
      cut_data = { id: cut_id, points: cut_points }.to_json
      # puts `which blender`
      # command = `blender -b -P #{Rails.root.join('lib/python_scripts/main.py')} -- '#{cut_data}'`
      # command = [ "blender", "-b", "-P", "#{Rails.root.join('lib/python_scripts/main.py')}", "--", cut_data ]
      # result = `docker-compose run --rm blender blender -b -P /scripts/main.py -- '#{cut_data}'`
      # result = `docker exec blender blender -b -P /scripts/main.py -- '#{cut_data}'`
      # puts "Blender実行結果: #{result}"

      # script_path = Rails.root.join('lib/python_scripts/main.py').to_s
      # puts "script_path: #{script_path}"
      command = [ "blender", "-b", "-P", "/app/lib/python_scripts/main.py", "--", cut_data ]
      stdout, stderr, status = Open3.capture3(*command)
      puts "Blender標準出力: #{stdout}"
      puts "Blenderエラー出力: #{stderr}"

      if status.success?
        puts "Blenderスクリプトは正常に実行されました"
      else
         puts "Blenderスクリプトにエラーがあります"
      end

      glb_file_name = "exported_cube_#{cut_id}.glb"
      ratio_file_name="ratio_#{cut_id}.txt"
      shared_glb_url = Rails.root.join("shared", glb_file_name)
      shared_ratio_url = Rails.root.join("shared", ratio_file_name)
      ratio = File.read(shared_ratio_url).to_f
      puts "GLBファイルの保存先であるshared_glb_urlは: #{shared_glb_url}"
      puts "ファイルにあるratioの値は: #{ratio}"

      user_id = current_user&.id

      cut_cube = CutCube.new(
        user_id: user_id,
        cookie_id: cookie_id,
        cut_id: cut_id,
        cut_points: cut_points,
        glb_file_name: glb_file_name,
        volume_ratio: ratio
      )
      cut_cube.gltf_file.attach(io: File.open(shared_glb_url), filename: glb_file_name)
      cut_cube.save!

      File.delete(shared_glb_url) if File.exist?(shared_glb_url)
      File.delete(shared_ratio_url) if File.exist?(shared_ratio_url)
      puts "GLBファイル削除済み: #{shared_glb_url}"
      puts "ratioファイル削除済み: #{shared_ratio_url}"

      render_cut_cube = {
        id: cut_cube.id,
        glb_url: url_for(cut_cube.gltf_file),
        cut_points: JSON.parse(cut_cube.cut_points),
        title: cut_cube.title,
        memo: cut_cube.memo,
        created_at: cut_cube.created_at,
        cut_face_name: nil,
        edge_length: nil,
        volume_ratio: ratio,

      }

      render json: { status: "success", cut_cube: render_cut_cube }, status: :ok
    else
      render json: { status: "error", message: "切断失敗" }, status: :unprocessable_entity
    end
  end

  def show
    cut_cube = CutCube.find_by(id: params[:id])

    if cut_cube.nil?
      render json: { error: "CutCube not found" }, status: :not_found
    end

    cut_cube_data = {
      glb_url: url_for(cut_cube.gltf_file),
      cut_points: JSON.parse(cut_cube.cut_points),
      title: cut_cube.title,
      memo: cut_cube.memo,
      created_at: cut_cube.created_at,
      cut_face_name: cut_cube.cut_face_name,
      volume_ratio: cut_cube.volume_ratio,
      edge_length: cut_cube.edge_length
    }

    bookmark_id = cut_cube.bookmark_id_for(current_user)

    render json: { cut_cube: cut_cube_data, bookmark_id: bookmark_id }, status: :ok
  end

  def index
    cut_cubes = CutCube.owned_by_user_or_cookie(current_user, cookies[:guest_id])

    if cut_cubes.present?
      cut_cubes_data = {
        ids: cut_cubes.map(&:id),
        glb_urls: cut_cubes.map { |cut_cube| url_for(cut_cube.gltf_file) },
        cut_points: cut_cubes.map { |cut_cube| JSON.parse(cut_cube.cut_points) },
        titles: cut_cubes.map(&:title),
        memos: cut_cubes.map(&:memo),
        created_at: cut_cubes.map(&:created_at),
        cut_face_names: cut_cubes.map(&:cut_face_name),
        volume_ratios: cut_cubes.map(&:volume_ratio)
    }

    bookmark_ids = cut_cubes.map { |cut_cube| cut_cube.bookmark_id_for(current_user) }
    render json: { cut_cubes: cut_cubes_data, bookmark_ids: bookmark_ids }, status: :ok
    else
      render json: { error: "CutCube not found" }, status: :not_found
    end
  end

  def destroy
    cut_cube = CutCube.find_by_user_or_cookie(current_user, cookies[:guest_id], params[:id])
    if cut_cube
      cut_cube.destroy
      cut_cube.gltf_file.purge
      render json: { status: "success", message: "CutCube deleted successfully" }, status: :ok
    else
      render json: { error: "CutCube not found" }, status: :not_found
    end
  end

  def update
    cut_cube = CutCube.find_by_user_or_cookie(current_user, cookies[:guest_id], params[:id])
    if cut_cube
      cut_cube.update(cut_cube_update_params)

      cut_cube_data = {
      title: cut_cube.title,
      memo: cut_cube.memo,
      volume_ratio: cut_cube.volume_ratio,
      cut_face_name: cut_cube.cut_face_name,
      edge_length: cut_cube.edge_length
    }
      render json: { status: "success", message: "CutCube updated successfully", cut_cube: cut_cube_data }, status: :ok
    else
      render json: { error: "CutCube not found" }, status: :not_found
    end
  end

  private

  def cut_cube_update_params
    params.require(:cut_cube).permit(:title, :memo, :cut_face_name, :edge_length)
  end
end
