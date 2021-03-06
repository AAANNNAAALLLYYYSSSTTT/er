class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.text :name, null: false
      t.text :description
      t.integer :status_id, null: false

      t.timestamps
    end
  end
end
