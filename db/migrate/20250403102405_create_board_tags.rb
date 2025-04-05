class CreateBoardTags < ActiveRecord::Migration[7.2]
  def change
    create_table :board_tags do |t|
      t.references :tag, foreign_key: true, null: false
      t.references :board, foreign_key: true, null: false
      t.timestamps
    end
  end
end
