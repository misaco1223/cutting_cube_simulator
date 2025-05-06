class AddVolumeRatioColumnToCutCubes < ActiveRecord::Migration[7.2]
  def change
    add_column :cut_cubes, :volume_ratio, :float
  end
end
