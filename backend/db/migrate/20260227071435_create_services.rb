class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services do |t|
      t.string :name
      t.references :category, null: false, foreign_key: true
      t.decimal :base_price

      t.timestamps
    end
  end
end
