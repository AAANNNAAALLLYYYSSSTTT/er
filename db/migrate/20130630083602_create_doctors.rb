class CreateDoctors < ActiveRecord::Migration
  def change
    create_table :doctors do |t|
      t.text :surname, null: false
      t.text :name, null: false
      t.text :patronymic
      t.integer :post_id, null: false
      t.text :cabinet
      t.text :description
      t.integer :status_id, null: false

      t.timestamps
    end
  end
end
