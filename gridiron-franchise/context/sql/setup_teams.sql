-- Create the teams table
create table if not exists public.teams (
  id uuid default gen_random_uuid() primary key,
  conference text not null,
  division text not null,
  city text not null,
  nickname text not null,
  abbreviation text not null unique,
  primary_color_name text not null,
  primary_color_hex text not null,
  secondary_color_name text not null,
  secondary_color_hex text not null,
  accent_color_name text not null,
  accent_color_hex text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.teams enable row level security;

-- Create a policy that allows everyone to read teams
create policy "Teams are viewable by everyone" on public.teams for select using (true);

-- Insert data
insert into public.teams (conference, division, city, nickname, abbreviation, primary_color_name, primary_color_hex, secondary_color_name, secondary_color_hex, accent_color_name, accent_color_hex) values
('Atlantic', 'Atlantic North', 'Boston', 'Rebels', 'BOS', 'Navy Blue', '#0A2240', 'Silver', '#A8A9AD', 'Red', '#C41E3A'),
('Atlantic', 'Atlantic North', 'Philadelphia', 'Ironworks', 'PHI', 'Steel Gray', '#5A5A5A', 'Rust Orange', '#B7410E', 'Black', '#1A1A1A'),
('Atlantic', 'Atlantic North', 'Pittsburgh', 'Riverhawks', 'PIT', 'Black', '#101820', 'Gold', '#FFB612', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic North', 'Baltimore', 'Knights', 'BAL', 'Purple', '#4B0082', 'Black', '#1A1A1A', 'Gold', '#CFB53B'),
('Atlantic', 'Atlantic South', 'Miami', 'Sharks', 'MIA', 'Aqua', '#008E97', 'Coral', '#FF6F61', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic South', 'Orlando', 'Thunder', 'ORL', 'Electric Blue', '#0057B8', 'Black', '#1A1A1A', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic South', 'Atlanta', 'Firebirds', 'ATL', 'Red', '#CE1141', 'Black', '#1A1A1A', 'Gold', '#FDBB30'),
('Atlantic', 'Atlantic South', 'Charlotte', 'Crowns', 'CLT', 'Royal Purple', '#5C2D91', 'Silver', '#C0C0C0', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic East', 'New York', 'Empire', 'NYE', 'Midnight Blue', '#0C2340', 'Orange', '#FF5F00', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic East', 'Brooklyn', 'Bolts', 'BKN', 'Electric Yellow', '#FFD100', 'Black', '#1A1A1A', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic East', 'Newark', 'Sentinels', 'NWK', 'Forest Green', '#154734', 'Silver', '#A8A9AD', 'Black', '#1A1A1A'),
('Atlantic', 'Atlantic East', 'Washington', 'Monuments', 'WAS', 'Marble White', '#F5F5F5', 'Navy', '#002244', 'Gold', '#B59410'),
('Atlantic', 'Atlantic West', 'Chicago', 'Blaze', 'CHI', 'Orange', '#FF6720', 'Black', '#1A1A1A', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic West', 'Detroit', 'Engines', 'DET', 'Honolulu Blue', '#0076B6', 'Silver', '#B0B7BC', 'Black', '#1A1A1A'),
('Atlantic', 'Atlantic West', 'Cleveland', 'Forge', 'CLE', 'Burnt Orange', '#EB3300', 'Brown', '#4C2600', 'White', '#FFFFFF'),
('Atlantic', 'Atlantic West', 'Indianapolis', 'Stampede', 'IND', 'Royal Blue', '#003DA5', 'White', '#FFFFFF', 'Red', '#D50032'),
('Pacific', 'Pacific North', 'Seattle', 'Storm', 'SEA', 'Pacific Blue', '#006B77', 'Neon Green', '#69FF47', 'Gray', '#7D7D7D'),
('Pacific', 'Pacific North', 'Portland', 'Timbers', 'POR', 'Evergreen', '#00482B', 'Cream', '#EBE5D5', 'Brown', '#5D4E37'),
('Pacific', 'Pacific North', 'Vancouver', 'Grizzlies', 'VAN', 'Dark Brown', '#3D291A', 'Ice Blue', '#A5D8E6', 'Tan', '#D2B48C'),
('Pacific', 'Pacific North', 'Denver', 'Summit', 'DEN', 'Sky Blue', '#5DADE2', 'White', '#FFFFFF', 'Orange', '#FC4C02'),
('Pacific', 'Pacific South', 'Los Angeles', 'Legends', 'LAL', 'Hollywood Gold', '#FFC72C', 'Black', '#1A1A1A', 'White', '#FFFFFF'),
('Pacific', 'Pacific South', 'San Diego', 'Surf', 'SDS', 'Ocean Blue', '#0077BE', 'Sand Gold', '#C9B037', 'White', '#FFFFFF'),
('Pacific', 'Pacific South', 'Las Vegas', 'Aces', 'LVA', 'Black', '#1A1A1A', 'Vegas Gold', '#C5B358', 'Red', '#FF0000'),
('Pacific', 'Pacific South', 'Phoenix', 'Scorpions', 'PHX', 'Desert Red', '#C41E3A', 'Sand', '#C2B280', 'Black', '#1A1A1A'),
('Pacific', 'Pacific East', 'Austin', 'Outlaws', 'AUS', 'Black', '#1A1A1A', 'Burnt Orange', '#BF5700', 'Silver', '#C0C0C0'),
('Pacific', 'Pacific East', 'Houston', 'Marshals', 'HOU', 'Navy', '#002D62', 'Red', '#CC0000', 'White', '#FFFFFF'),
('Pacific', 'Pacific East', 'Dallas', 'Lone Stars', 'DAL', 'Silver', '#8A8D8F', 'Royal Blue', '#002B5C', 'White', '#FFFFFF'),
('Pacific', 'Pacific East', 'San Antonio', 'Bandits', 'SAN', 'Black', '#1A1A1A', 'Fiesta Pink', '#E31C79', 'Turquoise', '#40E0D0'),
('Pacific', 'Pacific West', 'San Francisco', 'Gold Rush', 'SFO', 'Gold', '#FFB81C', 'Scarlet', '#B3002D', 'White', '#FFFFFF'),
('Pacific', 'Pacific West', 'Oakland', 'Raiders', 'OAK', 'Silver', '#A5ACAF', 'Black', '#1A1A1A', 'White', '#FFFFFF'),
('Pacific', 'Pacific West', 'Sacramento', 'Kings', 'SAC', 'Purple', '#5A2D82', 'Gray', '#8E9093', 'White', '#FFFFFF'),
('Pacific', 'Pacific West', 'Honolulu', 'Volcanoes', 'HON', 'Lava Red', '#CF1020', 'Black', '#1A1A1A', 'Orange', '#FF8C00');
