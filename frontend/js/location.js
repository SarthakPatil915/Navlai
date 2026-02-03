// ==================== Location Data JS ==================== //

const locationData = {
    india: {
        states: {
            maharashtra: {
                divisions: {
                    konkan: {
                        name: 'Konkan Division',
                        districts: {
                            'mumbai_city': {
                                name: 'Mumbai City',
                                talukas: ['Mumbai City'],
                                areas: ['Fort', 'Colaba', 'Marine Lines', 'Downtown Mumbai', 'Dadar', 'Kala Ghoda']
                            },
                            'mumbai_suburban': {
                                name: 'Mumbai Suburban',
                                talukas: ['Andheri', 'Borivali', 'Kurla'],
                                areas: ['Andheri', 'Bandra', 'Borivali', 'Thane', 'Navi Mumbai', 'Vile Parle']
                            },
                            'thane': {
                                name: 'Thane',
                                talukas: ['Thane', 'Kalyan', 'Ulhasnagar', 'Bhiwandi', 'Shahapur', 'Murbad', 'Ambernath'],
                                areas: ['Thane', 'Kalyan', 'Dombivli', 'Turbhe', 'Kasarvadavali', 'Ulhasnagar']
                            },
                            'palghar': {
                                name: 'Palghar',
                                talukas: ['Palghar', 'Vasai', 'Dahanu', 'Talasari', 'Wada', 'Vikramgad', 'Jawhar', 'Mokhada'],
                                areas: ['Palghar', 'Vasai', 'Dahanu', 'Jawhar', 'Wada', 'Mokhada']
                            },
                            'raigad': {
                                name: 'Raigad',
                                talukas: ['Alibag', 'Panvel', 'Uran', 'Karjat', 'Khalapur', 'Pen', 'Sudhagad', 'Roha', 'Mangaon', 'Shrivardhan', 'Mhasala', 'Tala', 'Mahad', 'Poladpur'],
                                areas: ['Panvel', 'Kharghar', 'Belapur', 'Nerul', 'Khanda', 'Alibag', 'Karjat']
                            },
                            'ratnagiri': {
                                name: 'Ratnagiri',
                                talukas: ['Ratnagiri', 'Chiplun', 'Khed', 'Dapoli', 'Guhagar', 'Sangameshwar', 'Rajapur', 'Lanja', 'Mandangad'],
                                areas: ['Ratnagiri', 'Chiplun', 'Sangameshwar', 'Dodamarge', 'Dapoli']
                            },
                            'sindhudurg': {
                                name: 'Sindhudurg',
                                talukas: ['Kudal', 'Sawantwadi', 'Malvan', 'Vengurla', 'Devgad', 'Kankavli', 'Vaibhavwadi', 'Dodamarg'],
                                areas: ['Malvan', 'Sawantwadi', 'Kudal', 'Kankavli', 'Vengurla']
                            }
                        }
                    },
                    pune: {
                        name: 'Pune Division (Western Maharashtra)',
                        districts: {
                            'pune': {
                                name: 'Pune',
                                talukas: ['Pune City', 'Haveli', 'Mulshi', 'Maval', 'Khed', 'Junnar', 'Ambegaon', 'Shirur', 'Daund', 'Baramati', 'Indapur', 'Bhor', 'Velhe', 'Purandar'],
                                areas: ['Pimpri-Chinchwad', 'Kalyani Nagar', 'Shivajinagar', 'Mundhwa', 'Viman Nagar', 'Hadapsar', 'Baner', 'Kothrud', 'Daund', 'Indapur']
                            },
                            'satara': {
                                name: 'Satara',
                                talukas: ['Satara', 'Karad', 'Wai', 'Mahabaleshwar', 'Koregaon', 'Khandala', 'Phaltan', 'Patan', 'Jaoli', 'Man'],
                                areas: ['Satara', 'Mahabaleshwar', 'Phaltan', 'Wai', 'Karad', 'Koregaon']
                            },
                            'sangli': {
                                name: 'Sangli',
                                talukas: ['Sangli', 'Miraj', 'Tasgaon', 'Kavathe Mahankal', 'Jat', 'Walwa', 'Shirala', 'Khanapur', 'Palus', 'Atpadi'],
                                areas: ['Sangli', 'Miraj', 'Walwa', 'Jambhali', 'Tasgaon']
                            },
                            'kolhapur': {
                                name: 'Kolhapur',
                                talukas: ['Karvir', 'Panhala', 'Shahuwadi', 'Radhanagari', 'Kagal', 'Hatkanangale', 'Shirol', 'Gadhinglaj', 'Chandgad', 'Ajra', 'Bhudargad', 'Gaganbawda'],
                                areas: ['Kolhapur', 'Ichalkaranji', 'Mahalingi', 'Ajara', 'Panhala']
                            },
                            'solapur': {
                                name: 'Solapur',
                                talukas: ['Solapur North', 'Solapur South', 'Akkalkot', 'Barshi', 'Madha', 'Malshiras', 'Pandharpur', 'Sangola', 'Mangalwedha', 'Mohol', 'Karmala'],
                                areas: ['Solapur', 'Barshi', 'Sangola', 'Akkalkot', 'Pandharpur']
                            }
                        }
                    },
                    nashik: {
                        name: 'Nashik Division (North Maharashtra)',
                        districts: {
                            'nashik': {
                                name: 'Nashik',
                                talukas: ['Nashik', 'Igatpuri', 'Dindori', 'Trimbakeshwar', 'Niphad', 'Sinnar', 'Yeola', 'Kalwan', 'Baglan', 'Surgana', 'Chandwad', 'Malegaon', 'Deola', 'Peth'],
                                areas: ['Nashik', 'Malegaon', 'Sinnar', 'Nandgaon', 'Panchavati', 'Igatpuri']
                            },
                            'ahmednagar': {
                                name: 'Ahmednagar',
                                talukas: ['Ahmednagar', 'Rahuri', 'Shrirampur', 'Nevasa', 'Shevgaon', 'Pathardi', 'Parner', 'Jamkhed', 'Karjat', 'Sangamner', 'Akole', 'Kopargaon', 'Rahata', 'Shrigonda'],
                                areas: ['Ahmednagar', 'Shrirampur', 'Rahata', 'Nagar', 'Parner', 'Nevasa']
                            },
                            'dhule': {
                                name: 'Dhule',
                                talukas: ['Dhule', 'Sakri', 'Shirpur', 'Sindkheda'],
                                areas: ['Dhule', 'Shirpur', 'Pimpalner', 'Sakri']
                            },
                            'jalgaon': {
                                name: 'Jalgaon',
                                talukas: ['Jalgaon', 'Bhusawal', 'Amalner', 'Chopda', 'Yawal', 'Raver', 'Jamner', 'Pachora', 'Chalisgaon', 'Parola', 'Dharangaon', 'Erandol', 'Bhadgaon', 'Muktainagar', 'Bodwad'],
                                areas: ['Jalgaon', 'Bhusawal', 'Amalner', 'Muktainagar', 'Chalisgaon']
                            },
                            'nandurbar': {
                                name: 'Nandurbar',
                                talukas: ['Nandurbar', 'Shahada', 'Taloda', 'Akrani', 'Akkalkuwa', 'Nawapur'],
                                areas: ['Nandurbar', 'Taloda', 'Akkalkuwa', 'Nawapur', 'Shahada']
                            }
                        }
                    },
                    aurangabad: {
                        name: 'Aurangabad Division (Marathwada)',
                        districts: {
                            'aurangabad': {
                                name: 'Aurangabad (Chhatrapati Sambhajinagar)',
                                talukas: ['Aurangabad', 'Kannad', 'Sillod', 'Phulambri', 'Khuldabad', 'Vaijapur', 'Gangapur', 'Paithan', 'Soegaon'],
                                areas: ['CIDCO', 'Garkheda', 'Shendra', 'Paithan Road', 'Cantonment', 'Aurangabad']
                            },
                            'jalna': {
                                name: 'Jalna',
                                talukas: ['Jalna', 'Bhokardan', 'Jafrabad', 'Badnapur', 'Ambad', 'Ghansawangi', 'Partur', 'Mantha'],
                                areas: ['Jalna', 'Ambad', 'Partur', 'Ghansawangi', 'Bhokardan']
                            },
                            'beed': {
                                name: 'Beed',
                                talukas: ['Beed', 'Ashti', 'Patoda', 'Shirur', 'Georai', 'Majalgaon', 'Parli', 'Kaij', 'Dharur', 'Wadwani'],
                                areas: ['Beed', 'Ambajogai', 'Ashti', 'Parli Vaijnath', 'Patoda']
                            },
                            'osmanabad': {
                                name: 'Osmanabad (Dharashiv)',
                                talukas: ['Osmanabad', 'Tuljapur', 'Omerga', 'Kalamb', 'Lohara', 'Paranda', 'Bhoom', 'Washi'],
                                areas: ['Osmanabad', 'Tuljapur', 'Paranda', 'Lohara', 'Omerga']
                            },
                            'latur': {
                                name: 'Latur',
                                talukas: ['Latur', 'Ausa', 'Nilanga', 'Udgir', 'Ahmadpur', 'Renapur', 'Chakur', 'Jalkot', 'Shirur Anantpal', 'Deoni'],
                                areas: ['Latur', 'Vikarabad', 'Nilanga', 'Deoni', 'Ausa']
                            },
                            'nanded': {
                                name: 'Nanded',
                                talukas: ['Nanded', 'Ardhapur', 'Mudkhed', 'Bhokar', 'Biloli', 'Naigaon', 'Loha', 'Kandhar', 'Kinwat', 'Himayatnagar', 'Hadgaon', 'Mahur', 'Deglur', 'Mukhed', 'Dharmabad', 'Umri'],
                                areas: ['Nanded', 'Hadgaon', 'Ashti', 'Billoli', 'Kandhar']
                            },
                            'parbhani': {
                                name: 'Parbhani',
                                talukas: ['Parbhani', 'Gangakhed', 'Pathri', 'Manwath', 'Jintur', 'Purna', 'Palam', 'Sonpeth', 'Selu'],
                                areas: ['Parbhani', 'Purna', 'Parli', 'Manwat', 'Gangakhed']
                            },
                            'hingoli': {
                                name: 'Hingoli',
                                talukas: ['Hingoli', 'Kalamnuri', 'Sengao', 'Aundha', 'Basmath'],
                                areas: ['Hingoli', 'Basmath', 'Sengaon', 'Aundha']
                            }
                        }
                    },
                    amravati: {
                        name: 'Amravati Division (Vidarbha)',
                        districts: {
                            'amravati': {
                                name: 'Amravati',
                                talukas: ['Amravati', 'Achalpur', 'Chandur Railway', 'Chandur Bazar', 'Daryapur', 'Anjangaon Surji', 'Morshi', 'Tiosa', 'Warud', 'Dharni', 'Chikhaldara', 'Nandgaon Khandeshwar'],
                                areas: ['Amravati', 'Morshi', 'Teosa', 'Chandur Bazar', 'Achalpur']
                            },
                            'akola': {
                                name: 'Akola',
                                talukas: ['Akola', 'Balapur', 'Patur', 'Barshitakli', 'Murtijapur', 'Telhara', 'Akot'],
                                areas: ['Akola', 'Barshi', 'Murtajapur', 'Patur', 'Akot']
                            },
                            'washim': {
                                name: 'Washim',
                                talukas: ['Washim', 'Mangrulpir', 'Malegaon', 'Karanja', 'Risod', 'Manora'],
                                areas: ['Washim', 'Karla', 'Maregaon', 'Mangrulpir', 'Malegaon']
                            },
                            'buldhana': {
                                name: 'Buldhana',
                                talukas: ['Buldhana', 'Chikhli', 'Deulgaon Raja', 'Mehkar', 'Sindkhed Raja', 'Malkapur', 'Motala', 'Nandura', 'Jalgaon Jamod', 'Khamgaon', 'Lonar', 'Shegaon', 'Sangrampur'],
                                areas: ['Buldhana', 'Malkapur', 'Shegaon', 'Chikhali', 'Khamgaon']
                            },
                            'yavatmal': {
                                name: 'Yavatmal',
                                talukas: ['Yavatmal', 'Darwha', 'Pusad', 'Umarkhed', 'Mahagaon', 'Kelapur', 'Ralegaon', 'Babulgaon', 'Kalamb', 'Arni', 'Digras', 'Ner', 'Zari Jamni', 'Ghatanji', 'Wani', 'Maregaon'],
                                areas: ['Yavatmal', 'Darwha', 'Ghatanji', 'Pusad', 'Arni']
                            }
                        }
                    },
                    nagpur: {
                        name: 'Nagpur Division (Vidarbha)',
                        districts: {
                            'nagpur': {
                                name: 'Nagpur',
                                talukas: ['Nagpur Urban', 'Nagpur Rural', 'Hingna', 'Kamptee', 'Katol', 'Narkhed', 'Savner', 'Kalmeshwar', 'Umred', 'Kuhi', 'Ramtek', 'Parseoni', 'Mauda'],
                                areas: ['Sitabuldi', 'Ramdaspeth', 'Dharampeth', 'Civil Lines', 'Sadar', 'Nagpur']
                            },
                            'wardha': {
                                name: 'Wardha',
                                talukas: ['Wardha', 'Deoli', 'Hinganghat', 'Arvi', 'Ashti', 'Karanja', 'Samudrapur', 'Seloo'],
                                areas: ['Wardha', 'Hinganghat', 'Arvi', 'Ashti', 'Deoli']
                            },
                            'bhandara': {
                                name: 'Bhandara',
                                talukas: ['Bhandara', 'Tumsar', 'Mohadi', 'Sakoli', 'Lakhandur', 'Pauni', 'Lakhani'],
                                areas: ['Bhandara', 'Pauni', 'Tumsar', 'Lakhanpal', 'Sakoli']
                            },
                            'gondia': {
                                name: 'Gondia',
                                talukas: ['Gondia', 'Tirora', 'Goregaon', 'Arjuni Morgaon', 'Deori', 'Amgaon', 'Salekasa', 'Sadak Arjuni'],
                                areas: ['Gondia', 'Goregaon', 'Sadak Arjuni', 'Kahapur', 'Tirora']
                            },
                            'chandrapur': {
                                name: 'Chandrapur',
                                talukas: ['Chandrapur', 'Ballarpur', 'Warora', 'Brahmapuri', 'Nagbhid', 'Sindewahi', 'Chimur', 'Bhadravati', 'Mul', 'Rajura', 'Korpana', 'Pombhurna', 'Sawali', 'Jiwati', 'Gondpipri'],
                                areas: ['Chandrapur', 'Ballarpur', 'Warora', 'Raj Nandgaon', 'Brahmapuri']
                            },
                            'gadchiroli': {
                                name: 'Gadchiroli',
                                talukas: ['Gadchiroli', 'Dhanora', 'Chamorshi', 'Mulchera', 'Aheri', 'Etapalli', 'Sironcha', 'Bhamragad', 'Korchi', 'Kurkheda', 'Desaiganj', 'Armori'],
                                areas: ['Gadchiroli', 'Aheri', 'Mulchera', 'Armori', 'Sironcha']
                            }
                        }
                    }
                }
            },
            karnataka: {
                districts: {
                    bangalore: {
                        talukas: ['Bangalore South', 'Bangalore East', 'Bangalore North', 'Bangalore West'],
                        areas: ['Indiranagar', 'Koramangala', 'Whitefield', 'Marathahalli', 'Yeshwanthpur', 'Vijayanagar']
                    },
                    mysore: {
                        talukas: ['Mysore', 'Yelawala', 'Heggadadevanakote'],
                        areas: ['Chamundi Hill', 'Lashkar Mohalla', 'Sayyaji Rao Road']
                    }
                }
            },
            tamil_nadu: {
                districts: {
                    chennai: {
                        talukas: ['Chennai South', 'Chennai Central', 'Chennai North'],
                        areas: ['Mylapore', 'Adyar', 'Velachery', 'Virugambakkam', 'T. Nagar']
                    },
                    coimbatore: {
                        talukas: ['Coimbatore', 'Pollachi'],
                        areas: ['Gandhipuram', 'Edayarpalayam', 'Avinashi Road']
                    }
                }
            }
        }
    }
};

// Populate location dropdowns
function populateLocationDropdowns() {
    // Country
    const countrySelect = document.getElementById('reg-country');
    if (countrySelect) {
        Object.keys(locationData).forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country.charAt(0).toUpperCase() + country.slice(1);
            countrySelect.appendChild(option);
        });
        
        countrySelect.addEventListener('change', updateStateDropdown);
    }
}

function updateStateDropdown() {
    const country = document.getElementById('reg-country').value;
    const stateSelect = document.getElementById('reg-state');
    
    stateSelect.innerHTML = '<option value="">Select State</option>';
    
    if (country && locationData[country]) {
        Object.keys(locationData[country].states).forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state.replace(/_/g, ' ').charAt(0).toUpperCase() + state.replace(/_/g, ' ').slice(1);
            stateSelect.appendChild(option);
        });
    }
    
    stateSelect.addEventListener('change', updateDistrictDropdown);
}

function updateDistrictDropdown() {
    const country = document.getElementById('reg-country').value;
    const state = document.getElementById('reg-state').value;
    const districtSelect = document.getElementById('reg-district');
    
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    if (country && state && locationData[country] && 
        locationData[country].states && locationData[country].states[state]) {
        
        const stateData = locationData[country].states[state];
        
        // Check if state has divisions (like Maharashtra)
        if (stateData.divisions) {
            Object.keys(stateData.divisions).forEach(division => {
                const divisionData = stateData.divisions[division];
                if (divisionData.districts) {
                    Object.keys(divisionData.districts).forEach(district => {
                        const option = document.createElement('option');
                        option.value = district;
                        const districtName = divisionData.districts[district].name || 
                            district.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        option.textContent = districtName;
                        districtSelect.appendChild(option);
                    });
                }
            });
        } 
        // Fallback: Check if state has direct districts
        else if (stateData.districts) {
            Object.keys(stateData.districts).forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                districtSelect.appendChild(option);
            });
        }
    }
    
    districtSelect.addEventListener('change', updateTalukaDropdown);
}

function updateTalukaDropdown() {
    const country = document.getElementById('reg-country').value;
    const state = document.getElementById('reg-state').value;
    const district = document.getElementById('reg-district').value;
    const talukaSelect = document.getElementById('reg-taluka');
    
    talukaSelect.innerHTML = '<option value="">Select Taluka</option>';
    
    if (country && state && district && locationData[country] && 
        locationData[country].states && locationData[country].states[state]) {
        
        const stateData = locationData[country].states[state];
        let districtData = null;
        
        // Check if state has divisions
        if (stateData.divisions) {
            // Search for district in all divisions
            for (const division of Object.keys(stateData.divisions)) {
                const divisionData = stateData.divisions[division];
                if (divisionData.districts && divisionData.districts[district]) {
                    districtData = divisionData.districts[district];
                    break;
                }
            }
        }
        // Fallback: Direct districts
        else if (stateData.districts && stateData.districts[district]) {
            districtData = stateData.districts[district];
        }
        
        if (districtData && districtData.talukas) {
            districtData.talukas.forEach(taluka => {
                const option = document.createElement('option');
                option.value = taluka;
                option.textContent = taluka;
                talukaSelect.appendChild(option);
            });
        }
    }
}

// For Dashboard - Filter location dropdowns
function populateDashboardLocationFilters() {
    const filterDistrict = document.getElementById('filter-district');
    const filterTaluka = document.getElementById('filter-taluka');
    const filterArea = document.getElementById('filter-area');
    
    if (filterDistrict) {
        // Get user's country and state from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.country && user.state) {
            const country = user.country;
            const state = user.state;
            
            if (locationData[country] && locationData[country].states[state]) {
                Object.keys(locationData[country].states[state].districts).forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district.charAt(0).toUpperCase() + district.slice(1);
                    filterDistrict.appendChild(option);
                });
                
                // Update taluka dropdown when district changes
                filterDistrict.addEventListener('change', () => {
                    const selectedDistrict = filterDistrict.value;
                    filterTaluka.innerHTML = '<option value="">All Talukas</option>';
                    
                    if (selectedDistrict && locationData[country].states[state].districts[selectedDistrict]) {
                        locationData[country].states[state].districts[selectedDistrict].talukas.forEach(taluka => {
                            const option = document.createElement('option');
                            option.value = taluka;
                            option.textContent = taluka;
                            filterTaluka.appendChild(option);
                        });
                    }
                });
            }
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('reg-country')) {
        populateLocationDropdowns();
    }
    if (document.getElementById('filter-district')) {
        populateDashboardLocationFilters();
    }
});
