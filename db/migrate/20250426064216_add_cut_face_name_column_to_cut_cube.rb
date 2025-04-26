class AddCutFaceNameColumnToCutCube < ActiveRecord::Migration[7.2]
  def change
    add_column :cut_cubes, :cut_face_name, :string
  end
end
