class CreateFavorites < ActiveRecord::Migration[7.2]
  def change
    create_table :favorites do |t|
      t.references :user, foreign_key: true, null: false, index: true
      t.references :board, foreign_key: true, null: false, index: true
      t.timestamps
    end

    add_index :favorites, [ :user_id, :board_id ], unique: true
  end
end
