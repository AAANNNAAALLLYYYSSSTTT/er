class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.text :name, null: false
      t.text :password_digest, null: false
      t.integer :role_id, null: false
      t.text :description
      t.integer :status_id, null: false

      t.timestamps
    end
  end
end
