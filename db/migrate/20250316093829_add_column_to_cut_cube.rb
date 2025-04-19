class AddColumnToCutCube < ActiveRecord::Migration[7.2]
  def change
    add_column :cut_cubes, :title, :string
    add_column :cut_cubes, :memo, :string
  end
end
