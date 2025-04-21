class CreateLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :likes do |t|
      t.references :user, foreign_key: true, null: false, index: true
      t.references :board, foreign_key: true, null: false, index: true
      t.timestamps
    end

    add_index :likes, [ :user_id, :board_id ], unique: true
  end
end
