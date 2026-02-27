# Clear existing data
puts "Clearing old data..."
WorkerService.destroy_all
JobRequest.destroy_all
WorkerProfile.destroy_all
Service.destroy_all
Category.destroy_all
City.destroy_all
User.destroy_all

# Cities
puts "Creating Cities..."
cities = ['Indore', 'Mumbai', 'Bhopal', 'Delhi', 'Pune']
cities.each { |city| City.create!(name: city) }

# Categories
puts "Creating Categories..."
electrician = Category.create!(name: 'Electrician', icon: 'zap')
plumber = Category.create!(name: 'Plumber', icon: 'droplet')
ac_repair = Category.create!(name: 'AC Repair', icon: 'wind')

# Services
puts "Creating Services..."
Service.create!([
  { name: 'Fan Repair', category: electrician, base_price: 150 },
  { name: 'Motor Rewinding', category: electrician, base_price: 800 },
  { name: 'Wiring Installation', category: electrician, base_price: 500 },
  { name: 'Switchboard Installation', category: electrician, base_price: 200 },
  
  { name: 'Pipe Leakage Repair', category: plumber, base_price: 250 },
  { name: 'Bathroom Fitting', category: plumber, base_price: 1500 },
  { name: 'Tap Replacement', category: plumber, base_price: 150 },
  
  { name: 'AC Servicing', category: ac_repair, base_price: 499 },
  { name: 'Gas Filling', category: ac_repair, base_price: 1500 }
])

puts "Seed complete!"