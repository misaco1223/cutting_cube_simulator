namespace :cleanup do
  desc "Delete expired guest data"
  task delete_expired_guest_data: :environment do
    CutCube.delete_expired_guest_data
  end
end
