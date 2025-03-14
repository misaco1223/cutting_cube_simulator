class CreateCutCubes < ActiveRecord::Migration[7.2]
  def change
    create_table :cut_cubes do |t|
      t.references :user, foreign_key: true
      t.string :cookie_id
      t.string :cut_id
      t.text :cut_points
      t.string :glb_file_name
      t.timestamps
    end
  end
end
