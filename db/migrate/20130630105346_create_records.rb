class CreateRecords < ActiveRecord::Migration
  def change
    create_table :records do |t|
      t.integer :account_id, null: false
      t.text :surname, null: false
      t.text :name, null: false
      t.text :patronymic
      t.text :card, null: false
      t.integer :doctor_id, null: false
      t.text :description
      t.integer :year, null: false
      t.integer :month, null: false
      t.integer :day, null: false
      t.integer :hour
      t.integer :minute
      t.integer :flag_id, null: false

      t.timestamps
    end
  end
end
