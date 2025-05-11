class AddEdgeLengthColumnToCutCubes < ActiveRecord::Migration[7.2]
  def change
    add_column :cut_cubes, :edge_length, :float
  end
end
