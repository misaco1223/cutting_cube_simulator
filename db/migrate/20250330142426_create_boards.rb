class CreateBoards < ActiveRecord::Migration[7.2]
  def change
    create_table :boards do |t|
      t.references :user, foreign_key: true 
      t.references :cut_cube, foreign_key:true
      t.text :question, null: false
      t.text :answer, null: false
      t.text :explanation
      t.boolean :published, default: false
      t.timestamps
    end
    add_index :boards, [:user_id, :cut_cube_id]
  end
end
