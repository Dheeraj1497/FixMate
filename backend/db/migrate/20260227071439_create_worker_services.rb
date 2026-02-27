class CreateWorkerServices < ActiveRecord::Migration[8.0]
  def change
    create_table :worker_services do |t|
      t.references :worker_profile, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true

      t.timestamps
    end
  end
end
