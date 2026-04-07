namespace RosraApp.Data
{
    /// <summary>
    /// Administrative divisions (states/provinces/regions) for all countries.
    /// Each entry: (CountryName, Region, Subregion, Capital, Currency, StateName, StateCode)
    /// Organized by continent for systematic maintenance.
    /// </summary>
    public static class CountryStatesData
    {
        public static List<(string Country, string Region, string Subregion, string Capital, string Currency, string StateName, string StateCode)> GetAll()
        {
            var data = new List<(string, string, string, string, string, string, string)>();
            data.AddRange(GetAfrica());
            data.AddRange(GetAsia());
            data.AddRange(GetEurope());
            data.AddRange(GetNorthAmerica());
            data.AddRange(GetSouthAmerica());
            data.AddRange(GetOceania());
            return data;
        }

        // ═══════════════════════════════════════════════════════
        //  AFRICA
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetAfrica()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // Kenya (47 counties)
            var ke = new[] { "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans-Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot" };
            foreach (var s in ke) d.Add(("Kenya", "Africa", "Eastern Africa", "Nairobi", "KES", s, "KE-" + s[..2].ToUpper()));

            // Nigeria (36 states + FCT)
            var ng = new[] { "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara" };
            foreach (var s in ng) d.Add(("Nigeria", "Africa", "Western Africa", "Abuja", "NGN", s, "NG"));

            // South Africa (9 provinces)
            var za = new[] { "Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","North West","Northern Cape","Western Cape" };
            foreach (var s in za) d.Add(("South Africa", "Africa", "Southern Africa", "Pretoria", "ZAR", s, "ZA"));

            // Ethiopia (11 regions + 2 chartered cities)
            var et = new[] { "Addis Ababa","Afar","Amhara","Benishangul-Gumuz","Dire Dawa","Gambela","Harari","Oromia","Sidama","Somali","South West Ethiopia","Southern Nations","Tigray" };
            foreach (var s in et) d.Add(("Ethiopia", "Africa", "Eastern Africa", "Addis Ababa", "ETB", s, "ET"));

            // Ghana (16 regions)
            var gh = new[] { "Ahafo","Ashanti","Bono","Bono East","Central","Eastern","Greater Accra","North East","Northern","Oti","Savannah","Upper East","Upper West","Volta","Western","Western North" };
            foreach (var s in gh) d.Add(("Ghana", "Africa", "Western Africa", "Accra", "GHS", s, "GH"));

            // Tanzania (31 regions)
            var tz = new[] { "Arusha","Dar es Salaam","Dodoma","Geita","Iringa","Kagera","Katavi","Kigoma","Kilimanjaro","Lindi","Manyara","Mara","Mbeya","Morogoro","Mtwara","Mwanza","Njombe","Pemba North","Pemba South","Pwani","Rukwa","Ruvuma","Shinyanga","Simiyu","Singida","Songwe","Tabora","Tanga","Unguja North","Unguja South","Zanzibar" };
            foreach (var s in tz) d.Add(("Tanzania", "Africa", "Eastern Africa", "Dodoma", "TZS", s, "TZ"));

            // Uganda (4 regions / 135 districts — using regions)
            var ug = new[] { "Central","Eastern","Northern","Western","Kampala","Wakiso","Mukono","Jinja","Gulu","Mbarara","Lira","Mbale","Soroti","Fort Portal","Masaka","Arua","Kabale","Hoima","Tororo","Iganga" };
            foreach (var s in ug) d.Add(("Uganda", "Africa", "Eastern Africa", "Kampala", "UGX", s, "UG"));

            // Rwanda (5 provinces)
            var rw = new[] { "Kigali","Eastern","Northern","Southern","Western" };
            foreach (var s in rw) d.Add(("Rwanda", "Africa", "Eastern Africa", "Kigali", "RWF", s, "RW"));

            // Egypt (27 governorates)
            var eg = new[] { "Alexandria","Aswan","Asyut","Beheira","Beni Suef","Cairo","Dakahlia","Damietta","Faiyum","Gharbia","Giza","Ismailia","Kafr El Sheikh","Luxor","Matrouh","Minya","Monufia","New Valley","North Sinai","Port Said","Qalyubia","Qena","Red Sea","Sharqia","Sohag","South Sinai","Suez" };
            foreach (var s in eg) d.Add(("Egypt", "Africa", "Northern Africa", "Cairo", "EGP", s, "EG"));

            // Morocco (12 regions)
            var ma = new[] { "Beni Mellal-Khénifra","Casablanca-Settat","Dakhla-Oued Ed-Dahab","Drâa-Tafilalet","Fès-Meknès","Guelmim-Oued Noun","Laâyoune-Sakia El Hamra","Marrakech-Safi","Oriental","Rabat-Salé-Kénitra","Souss-Massa","Tanger-Tétouan-Al Hoceïma" };
            foreach (var s in ma) d.Add(("Morocco", "Africa", "Northern Africa", "Rabat", "MAD", s, "MA"));

            // Senegal (14 regions)
            var sn = new[] { "Dakar","Diourbel","Fatick","Kaffrine","Kaolack","Kédougou","Kolda","Louga","Matam","Saint-Louis","Sédhiou","Tambacounda","Thiès","Ziguinchor" };
            foreach (var s in sn) d.Add(("Senegal", "Africa", "Western Africa", "Dakar", "XOF", s, "SN"));

            // Cameroon (10 regions)
            var cm = new[] { "Adamawa","Centre","East","Far North","Littoral","North","Northwest","South","Southwest","West" };
            foreach (var s in cm) d.Add(("Cameroon", "Africa", "Middle Africa", "Yaoundé", "XAF", s, "CM"));

            // Zambia (10 provinces)
            var zm = new[] { "Central","Copperbelt","Eastern","Luapula","Lusaka","Muchinga","Northern","North-Western","Southern","Western" };
            foreach (var s in zm) d.Add(("Zambia", "Africa", "Eastern Africa", "Lusaka", "ZMW", s, "ZM"));

            // Zimbabwe (10 provinces)
            var zw = new[] { "Bulawayo","Harare","Manicaland","Mashonaland Central","Mashonaland East","Mashonaland West","Masvingo","Matabeleland North","Matabeleland South","Midlands" };
            foreach (var s in zw) d.Add(("Zimbabwe", "Africa", "Eastern Africa", "Harare", "ZWL", s, "ZW"));

            // Mozambique (11 provinces)
            var mz = new[] { "Cabo Delgado","Gaza","Inhambane","Manica","Maputo City","Maputo Province","Nampula","Niassa","Sofala","Tete","Zambezia" };
            foreach (var s in mz) d.Add(("Mozambique", "Africa", "Eastern Africa", "Maputo", "MZN", s, "MZ"));

            // Malawi (3 regions / 28 districts — using major districts)
            var mw = new[] { "Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa","Karonga","Kasungu","Lilongwe","Machinga","Mangochi","Mchinji","Mulanje","Mzimba","Nkhata Bay","Nkhotakota","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba" };
            foreach (var s in mw) d.Add(("Malawi", "Africa", "Eastern Africa", "Lilongwe", "MWK", s, "MW"));

            // Burkina Faso (13 regions)
            var bf = new[] { "Boucle du Mouhoun","Cascades","Centre","Centre-Est","Centre-Nord","Centre-Ouest","Centre-Sud","Est","Hauts-Bassins","Nord","Plateau-Central","Sahel","Sud-Ouest" };
            foreach (var s in bf) d.Add(("Burkina Faso", "Africa", "Western Africa", "Ouagadougou", "XOF", s, "BF"));

            // Mali (10 regions + Bamako)
            var ml = new[] { "Bamako","Gao","Kayes","Kidal","Koulikoro","Ménaka","Mopti","Ségou","Sikasso","Taoudénit","Tombouctou" };
            foreach (var s in ml) d.Add(("Mali", "Africa", "Western Africa", "Bamako", "XOF", s, "ML"));

            // Ivory Coast / Cote d'Ivoire (14 districts)
            var ci = new[] { "Abidjan","Bas-Sassandra","Comoé","Denguélé","Gôh-Djiboua","Lacs","Lagunes","Montagnes","Sassandra-Marahoué","Savanes","Vallée du Bandama","Woroba","Yamoussoukro","Zanzan" };
            foreach (var s in ci) d.Add(("Ivory Coast", "Africa", "Western Africa", "Yamoussoukro", "XOF", s, "CI"));

            // Niger (8 regions)
            var ne = new[] { "Agadez","Diffa","Dosso","Maradi","Niamey","Tahoua","Tillabéri","Zinder" };
            foreach (var s in ne) d.Add(("Niger", "Africa", "Western Africa", "Niamey", "XOF", s, "NE"));

            // Benin (12 departments)
            var bj = new[] { "Alibori","Atacora","Atlantique","Borgou","Collines","Couffo","Donga","Littoral","Mono","Ouémé","Plateau","Zou" };
            foreach (var s in bj) d.Add(("Benin", "Africa", "Western Africa", "Porto-Novo", "XOF", s, "BJ"));

            // Togo (5 regions)
            var tg = new[] { "Centrale","Kara","Maritime","Plateaux","Savanes" };
            foreach (var s in tg) d.Add(("Togo", "Africa", "Western Africa", "Lomé", "XOF", s, "TG"));

            // Sierra Leone (5 provinces)
            var sl = new[] { "Eastern","North West","Northern","Southern","Western Area" };
            foreach (var s in sl) d.Add(("Sierra Leone", "Africa", "Western Africa", "Freetown", "SLL", s, "SL"));

            // Botswana (10 districts)
            var bw = new[] { "Central","Ghanzi","Kgalagadi","Kgatleng","Kweneng","North-East","North-West","South-East","Southern","City of Francistown" };
            foreach (var s in bw) d.Add(("Botswana", "Africa", "Southern Africa", "Gaborone", "BWP", s, "BW"));

            // Namibia (14 regions)
            var na = new[] { "Erongo","Hardap","Karas","Kavango East","Kavango West","Khomas","Kunene","Ohangwena","Omaheke","Omusati","Oshana","Oshikoto","Otjozondjupa","Zambezi" };
            foreach (var s in na) d.Add(("Namibia", "Africa", "Southern Africa", "Windhoek", "NAD", s, "NA"));

            // Angola (18 provinces)
            var ao = new[] { "Bengo","Benguela","Bié","Cabinda","Cuando Cubango","Cuanza Norte","Cuanza Sul","Cunene","Huambo","Huíla","Icolo e Bengo","Luanda","Lunda Norte","Lunda Sul","Malanje","Moxico","Namibe","Uíge","Zaire" };
            foreach (var s in ao) d.Add(("Angola", "Africa", "Middle Africa", "Luanda", "AOA", s, "AO"));

            // Algeria (48 wilayas — major ones)
            var dz = new[] { "Adrar","Algiers","Annaba","Batna","Béchar","Béjaïa","Biskra","Blida","Bordj Bou Arréridj","Bouira","Constantine","Djelfa","El Oued","Ghardaia","Jijel","Médéa","Mostaganem","M'Sila","Oran","Ouargla","Relizane","Sétif","Sidi Bel Abbès","Skikda","Tébessa","Tiaret","Tizi Ouzou","Tlemcen" };
            foreach (var s in dz) d.Add(("Algeria", "Africa", "Northern Africa", "Algiers", "DZD", s, "DZ"));

            // Burundi (18 provinces)
            var bi = new[] { "Bubanza","Bujumbura Mairie","Bujumbura Rural","Bururi","Cankuzo","Cibitoke","Gitega","Karuzi","Kayanza","Kirundo","Makamba","Muramvya","Muyinga","Mwaro","Ngozi","Rumonge","Rutana","Ruyigi" };
            foreach (var s in bi) d.Add(("Burundi", "Africa", "Eastern Africa", "Gitega", "BIF", s, "BI"));

            // Chad (23 regions)
            var td = new[] { "Batha","Borkou","Chari-Baguirmi","Ennedi-Est","Ennedi-Ouest","Guéra","Hadjer-Lamis","Kanem","Lac","Logone Occidental","Logone Oriental","Mandoul","Mayo-Kebbi Est","Mayo-Kebbi Ouest","Moyen-Chari","N'Djamena","Ouaddaï","Salamat","Sila","Tandjilé","Tibesti","Wadi Fira" };
            foreach (var s in td) d.Add(("Chad", "Africa", "Middle Africa", "N'Djamena", "XAF", s, "TD"));

            // Cabo Verde (22 municipalities — major islands)
            var cv = new[] { "Boa Vista","Brava","Fogo","Maio","Sal","Santiago","Santo Antão","São Nicolau","São Vicente" };
            foreach (var s in cv) d.Add(("Cabo Verde", "Africa", "Western Africa", "Praia", "CVE", s, "CV"));

            // Djibouti (6 regions)
            var dj = new[] { "Ali Sabieh","Arta","Dikhil","Djibouti","Obock","Tadjourah" };
            foreach (var s in dj) d.Add(("Djibouti", "Africa", "Eastern Africa", "Djibouti", "DJF", s, "DJ"));

            // Eswatini (4 districts)
            var sz = new[] { "Hhohho","Lubombo","Manzini","Shiselweni" };
            foreach (var s in sz) d.Add(("Eswatini", "Africa", "Southern Africa", "Mbabane", "SZL", s, "SZ"));

            // Gambia (5 divisions + 1 city)
            var gm = new[] { "Banjul","Central River","Lower River","North Bank","Upper River","Western" };
            foreach (var s in gm) d.Add(("Gambia", "Africa", "Western Africa", "Banjul", "GMD", s, "GM"));

            // Guinea (8 regions)
            var gn = new[] { "Boké","Conakry","Faranah","Kankan","Kindia","Labé","Mamou","N'Zérékoré" };
            foreach (var s in gn) d.Add(("Guinea", "Africa", "Western Africa", "Conakry", "GNF", s, "GN"));

            // Liberia (15 counties)
            var lr = new[] { "Bomi","Bong","Gbarpolu","Grand Bassa","Grand Cape Mount","Grand Gedeh","Grand Kru","Lofa","Margibi","Maryland","Montserrado","Nimba","River Cess","River Gee","Sinoe" };
            foreach (var s in lr) d.Add(("Liberia", "Africa", "Western Africa", "Monrovia", "LRD", s, "LR"));

            // Madagascar (6 provinces)
            var mg = new[] { "Antananarivo","Antsiranana","Fianarantsoa","Mahajanga","Toamasina","Toliara" };
            foreach (var s in mg) d.Add(("Madagascar", "Africa", "Eastern Africa", "Antananarivo", "MGA", s, "MG"));

            // Mauritania (15 regions)
            var mr = new[] { "Adrar","Assaba","Brakna","Dakhlet Nouadhibou","Gorgol","Guidimaka","Hodh Ech Chargui","Hodh El Gharbi","Inchiri","Nouakchott Nord","Nouakchott Ouest","Nouakchott Sud","Tagant","Tiris Zemmour","Trarza" };
            foreach (var s in mr) d.Add(("Mauritania", "Africa", "Western Africa", "Nouakchott", "MRU", s, "MR"));

            // Mauritius (9 districts)
            var mu = new[] { "Black River","Flacq","Grand Port","Moka","Pamplemousses","Plaines Wilhems","Port Louis","Rivière du Rempart","Savanne" };
            foreach (var s in mu) d.Add(("Mauritius", "Africa", "Eastern Africa", "Port Louis", "MUR", s, "MU"));

            // Seychelles (26 districts — major ones)
            var sc = new[] { "Anse Boileau","Anse Royale","Baie Lazare","Beau Vallon","Bel Air","English River","Grand Anse Mahé","Mont Buxton","Plaisance","Port Glaud","Takamaka","Victoria" };
            foreach (var s in sc) d.Add(("Seychelles", "Africa", "Eastern Africa", "Victoria", "SCR", s, "SC"));

            // Somalia (18 regions — major ones)
            var so = new[] { "Awdal","Bakool","Banaadir","Bari","Bay","Galguduud","Gedo","Hiiraan","Jubbada Dhexe","Jubbada Hoose","Mudug","Nugaal","Sanaag","Shabeellaha Dhexe","Shabeellaha Hoose","Sool","Togdheer","Woqooyi Galbeed" };
            foreach (var s in so) d.Add(("Somalia", "Africa", "Eastern Africa", "Mogadishu", "SOS", s, "SO"));

            // Tunisia (24 governorates)
            var tn = new[] { "Ariana","Béja","Ben Arous","Bizerte","Gabès","Gafsa","Jendouba","Kairouan","Kasserine","Kébili","Kef","Mahdia","Manouba","Médenine","Monastir","Nabeul","Sfax","Sidi Bouzid","Siliana","Sousse","Tataouine","Tozeur","Tunis","Zaghouan" };
            foreach (var s in tn) d.Add(("Tunisia", "Africa", "Northern Africa", "Tunis", "TND", s, "TN"));

            // Côte d'Ivoire (duplicate name mapping)
            foreach (var s in ci) d.Add(("Côte d'Ivoire", "Africa", "Western Africa", "Yamoussoukro", "XOF", s, "CI"));

            return d;
        }

        // ═══════════════════════════════════════════════════════
        //  ASIA
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetAsia()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // India (28 states + 8 UTs)
            var ind = new[] { "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal" };
            foreach (var s in ind) d.Add(("India", "Asia", "Southern Asia", "New Delhi", "INR", s, "IN"));

            // China (31 provinces/regions)
            var cn = new[] { "Anhui","Beijing","Chongqing","Fujian","Gansu","Guangdong","Guangxi","Guizhou","Hainan","Hebei","Heilongjiang","Henan","Hubei","Hunan","Inner Mongolia","Jiangsu","Jiangxi","Jilin","Liaoning","Ningxia","Qinghai","Shaanxi","Shandong","Shanghai","Shanxi","Sichuan","Tianjin","Tibet","Xinjiang","Yunnan","Zhejiang" };
            foreach (var s in cn) d.Add(("China", "Asia", "Eastern Asia", "Beijing", "CNY", s, "CN"));

            // Indonesia (34 provinces — major ones)
            var id = new[] { "Aceh","Bali","Banten","Central Java","Central Kalimantan","Central Sulawesi","East Java","East Kalimantan","East Nusa Tenggara","Jakarta","Lampung","North Sulawesi","North Sumatra","Papua","Riau","South Kalimantan","South Sulawesi","South Sumatra","West Java","West Kalimantan","West Nusa Tenggara","West Papua","West Sumatra","Yogyakarta" };
            foreach (var s in id) d.Add(("Indonesia", "Asia", "South-Eastern Asia", "Jakarta", "IDR", s, "ID"));

            // Pakistan (4 provinces + territories)
            var pk = new[] { "Balochistan","Islamabad","Khyber Pakhtunkhwa","Punjab","Sindh","Azad Kashmir","Gilgit-Baltistan" };
            foreach (var s in pk) d.Add(("Pakistan", "Asia", "Southern Asia", "Islamabad", "PKR", s, "PK"));

            // Bangladesh (8 divisions)
            var bd = new[] { "Barishal","Chattogram","Dhaka","Khulna","Mymensingh","Rajshahi","Rangpur","Sylhet" };
            foreach (var s in bd) d.Add(("Bangladesh", "Asia", "Southern Asia", "Dhaka", "BDT", s, "BD"));

            // Philippines (17 regions)
            var ph = new[] { "Ilocos","Cagayan Valley","Central Luzon","CALABARZON","MIMAROPA","Bicol","Western Visayas","Central Visayas","Eastern Visayas","Zamboanga Peninsula","Northern Mindanao","Davao","SOCCSKSARGEN","Caraga","BARMM","Cordillera","NCR" };
            foreach (var s in ph) d.Add(("Philippines", "Asia", "South-Eastern Asia", "Manila", "PHP", s, "PH"));

            // Thailand (77 provinces — major ones)
            var th = new[] { "Bangkok","Chiang Mai","Chiang Rai","Chon Buri","Khon Kaen","Krabi","Nakhon Ratchasima","Nonthaburi","Pathum Thani","Phuket","Samut Prakan","Songkhla","Surat Thani","Udon Thani" };
            foreach (var s in th) d.Add(("Thailand", "Asia", "South-Eastern Asia", "Bangkok", "THB", s, "TH"));

            // Vietnam (63 provinces — major ones)
            var vn = new[] { "An Giang","Ba Ria-Vung Tau","Binh Duong","Can Tho","Da Nang","Dong Nai","Ha Noi","Hai Phong","Ho Chi Minh City","Khanh Hoa","Lam Dong","Nghe An","Quang Ninh","Thanh Hoa" };
            foreach (var s in vn) d.Add(("Vietnam", "Asia", "South-Eastern Asia", "Hanoi", "VND", s, "VN"));

            // Japan (47 prefectures — major ones)
            var jp = new[] { "Aichi","Chiba","Fukuoka","Hiroshima","Hokkaido","Hyogo","Kanagawa","Kyoto","Nagano","Niigata","Osaka","Saitama","Shizuoka","Tokyo" };
            foreach (var s in jp) d.Add(("Japan", "Asia", "Eastern Asia", "Tokyo", "JPY", s, "JP"));

            // South Korea (17 divisions)
            var kr = new[] { "Busan","Chungcheongbuk","Chungcheongnam","Daegu","Daejeon","Gangwon","Gwangju","Gyeonggi","Gyeongsangbuk","Gyeongsangnam","Incheon","Jeju","Jeollabuk","Jeollanam","Sejong","Seoul","Ulsan" };
            foreach (var s in kr) d.Add(("South Korea", "Asia", "Eastern Asia", "Seoul", "KRW", s, "KR"));

            // Turkey (81 provinces — major ones)
            var tr = new[] { "Adana","Ankara","Antalya","Bursa","Diyarbakir","Eskisehir","Gaziantep","Istanbul","Izmir","Kayseri","Konya","Mersin","Samsun","Trabzon" };
            foreach (var s in tr) d.Add(("Turkey", "Asia", "Western Asia", "Ankara", "TRY", s, "TR"));

            // UAE (7 emirates)
            var ae = new[] { "Abu Dhabi","Ajman","Dubai","Fujairah","Ras Al Khaimah","Sharjah","Umm Al Quwain" };
            foreach (var s in ae) d.Add(("United Arab Emirates", "Asia", "Western Asia", "Abu Dhabi", "AED", s, "AE"));

            // Saudi Arabia (13 regions)
            var sa = new[] { "Al Bahah","Al Jawf","Al Madinah","Al Qassim","Asir","Eastern Province","Ha'il","Jazan","Makkah","Najran","Northern Borders","Riyadh","Tabuk" };
            foreach (var s in sa) d.Add(("Saudi Arabia", "Asia", "Western Asia", "Riyadh", "SAR", s, "SA"));

            // Malaysia (13 states + 3 territories)
            var my = new[] { "Johor","Kedah","Kelantan","Kuala Lumpur","Labuan","Melaka","Negeri Sembilan","Pahang","Penang","Perak","Perlis","Putrajaya","Sabah","Sarawak","Selangor","Terengganu" };
            foreach (var s in my) d.Add(("Malaysia", "Asia", "South-Eastern Asia", "Kuala Lumpur", "MYR", s, "MY"));

            // Sri Lanka (9 provinces)
            var lk = new[] { "Central","Eastern","North Central","North Western","Northern","Sabaragamuwa","Southern","Uva","Western" };
            foreach (var s in lk) d.Add(("Sri Lanka", "Asia", "Southern Asia", "Colombo", "LKR", s, "LK"));

            // Nepal (7 provinces)
            var np = new[] { "Bagmati","Gandaki","Karnali","Koshi","Lumbini","Madhesh","Sudurpashchim" };
            foreach (var s in np) d.Add(("Nepal", "Asia", "Southern Asia", "Kathmandu", "NPR", s, "NP"));

            // Cambodia (25 provinces — major ones)
            var kh = new[] { "Banteay Meanchey","Battambang","Kampong Cham","Kampong Thom","Kandal","Phnom Penh","Prey Veng","Siem Reap","Svay Rieng","Takeo" };
            foreach (var s in kh) d.Add(("Cambodia", "Asia", "South-Eastern Asia", "Phnom Penh", "KHR", s, "KH"));

            // Jordan (12 governorates)
            var jo = new[] { "Ajloun","Amman","Aqaba","Balqa","Irbid","Jarash","Karak","Ma'an","Madaba","Mafraq","Tafilah","Zarqa" };
            foreach (var s in jo) d.Add(("Jordan", "Asia", "Western Asia", "Amman", "JOD", s, "JO"));

            // Azerbaijan (10 economic regions)
            var az = new[] { "Absheron","Aran","Daglig-Shirvan","Ganja-Qazakh","Kalbajar-Lachin","Lankaran","Nakhchivan","Shaki-Zagatala","Yukhari-Garabakh","Baku" };
            foreach (var s in az) d.Add(("Azerbaijan", "Asia", "Western Asia", "Baku", "AZN", s, "AZ"));

            // Georgia (9 regions + 2 autonomous)
            var ge = new[] { "Adjara","Guria","Imereti","Kakheti","Kvemo Kartli","Mtskheta-Mtianeti","Racha-Lechkhumi","Samegrelo-Zemo Svaneti","Samtskhe-Javakheti","Shida Kartli","Tbilisi" };
            foreach (var s in ge) d.Add(("Georgia", "Asia", "Western Asia", "Tbilisi", "GEL", s, "GE"));

            // Israel (6 districts)
            var il = new[] { "Central","Haifa","Jerusalem","Northern","Southern","Tel Aviv" };
            foreach (var s in il) d.Add(("Israel", "Asia", "Western Asia", "Jerusalem", "ILS", s, "IL"));

            // Kazakhstan (17 regions)
            var kz = new[] { "Almaty","Almaty Region","Astana","Atyrau","East Kazakhstan","Karaganda","Kostanay","Kyzylorda","Mangystau","North Kazakhstan","Pavlodar","Shymkent","Turkistan","West Kazakhstan","Zhambyl","Akmola","Aktobe" };
            foreach (var s in kz) d.Add(("Kazakhstan", "Asia", "Central Asia", "Astana", "KZT", s, "KZ"));

            // Kyrgyzstan (7 regions)
            var kg = new[] { "Batken","Bishkek","Chuy","Issyk-Kul","Jalal-Abad","Naryn","Osh","Talas" };
            foreach (var s in kg) d.Add(("Kyrgyzstan", "Asia", "Central Asia", "Bishkek", "KGS", s, "KG"));

            // Mongolia (21 aimags + Ulaanbaatar)
            var mn = new[] { "Arkhangai","Bayan-Ölgii","Bayankhongor","Bulgan","Darkhan-Uul","Dornod","Dornogovi","Dundgovi","Govi-Altai","Govisümber","Khentii","Khovd","Khövsgöl","Orkhon","Ömnögovi","Övörkhangai","Selenge","Sükhbaatar","Töv","Tuv","Ulaanbaatar","Uvs","Zavkhan" };
            foreach (var s in mn) d.Add(("Mongolia", "Asia", "Eastern Asia", "Ulaanbaatar", "MNT", s, "MN"));

            // Myanmar (7 states + 7 regions)
            var mm = new[] { "Ayeyarwady","Bago","Chin","Kachin","Kayah","Kayin","Magway","Mandalay","Mon","Naypyidaw","Rakhine","Sagaing","Shan","Tanintharyi","Yangon" };
            foreach (var s in mm) d.Add(("Myanmar", "Asia", "South-Eastern Asia", "Naypyidaw", "MMK", s, "MM"));

            // Tajikistan (4 regions)
            var tj = new[] { "Dushanbe","Gorno-Badakhshan","Khatlon","Sughd","Districts of Republican Subordination" };
            foreach (var s in tj) d.Add(("Tajikistan", "Asia", "Central Asia", "Dushanbe", "TJS", s, "TJ"));

            // Uzbekistan (12 regions + Karakalpakstan + Tashkent)
            var uz = new[] { "Andijan","Bukhara","Fergana","Jizzakh","Karakalpakstan","Kashkadarya","Khorezm","Namangan","Navoi","Samarkand","Surkhandarya","Syrdarya","Tashkent","Tashkent City" };
            foreach (var s in uz) d.Add(("Uzbekistan", "Asia", "Central Asia", "Tashkent", "UZS", s, "UZ"));

            // Viet Nam (duplicate name for Vietnam)
            foreach (var s in vn) d.Add(("Viet Nam", "Asia", "South-Eastern Asia", "Hanoi", "VND", s, "VN"));

            // Korea (duplicate for South Korea)
            foreach (var s in kr) d.Add(("Korea", "Asia", "Eastern Asia", "Seoul", "KRW", s, "KR"));

            // Türkiye (duplicate for Turkey)
            foreach (var s in tr) d.Add(("Türkiye", "Asia", "Western Asia", "Ankara", "TRY", s, "TR"));

            // West Bank and Gaza Strip
            var ps = new[] { "Bethlehem","Deir al-Balah","Gaza","Hebron","Jenin","Jericho","Jerusalem","Khan Yunis","Nablus","North Gaza","Qalqilya","Rafah","Ramallah and al-Bireh","Salfit","Tubas","Tulkarm" };
            foreach (var s in ps) d.Add(("West Bank and Gaza Strip", "Asia", "Western Asia", "Ramallah", "ILS", s, "PS"));

            return d;
        }

        // ═══════════════════════════════════════════════════════
        //  EUROPE
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetEurope()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // United Kingdom (4 nations + regions)
            var gb = new[] { "England","Scotland","Wales","Northern Ireland","Greater London","South East","South West","West Midlands","East Midlands","North West","North East","Yorkshire and the Humber","East of England" };
            foreach (var s in gb) d.Add(("United Kingdom", "Europe", "Northern Europe", "London", "GBP", s, "GB"));

            // France (18 regions)
            var fr = new[] { "Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Bretagne","Centre-Val de Loire","Corse","Grand Est","Guadeloupe","Guyane","Hauts-de-France","Île-de-France","La Réunion","Martinique","Mayotte","Normandie","Nouvelle-Aquitaine","Occitanie","Pays de la Loire","Provence-Alpes-Côte d'Azur" };
            foreach (var s in fr) d.Add(("France", "Europe", "Western Europe", "Paris", "EUR", s, "FR"));

            // Germany (16 states)
            var de = new[] { "Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia" };
            foreach (var s in de) d.Add(("Germany", "Europe", "Western Europe", "Berlin", "EUR", s, "DE"));

            // Italy (20 regions)
            var it = new[] { "Abruzzo","Aosta Valley","Apulia","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli Venezia Giulia","Lazio","Liguria","Lombardy","Marche","Molise","Piedmont","Sardinia","Sicily","Trentino-South Tyrol","Tuscany","Umbria","Veneto" };
            foreach (var s in it) d.Add(("Italy", "Europe", "Southern Europe", "Rome", "EUR", s, "IT"));

            // Spain (17 autonomous communities)
            var es = new[] { "Andalusia","Aragon","Asturias","Balearic Islands","Basque Country","Canary Islands","Cantabria","Castile and León","Castilla-La Mancha","Catalonia","Extremadura","Galicia","La Rioja","Madrid","Murcia","Navarre","Valencian Community" };
            foreach (var s in es) d.Add(("Spain", "Europe", "Southern Europe", "Madrid", "EUR", s, "ES"));

            // Netherlands (12 provinces)
            var nl = new[] { "Drenthe","Flevoland","Friesland","Gelderland","Groningen","Limburg","North Brabant","North Holland","Overijssel","South Holland","Utrecht","Zeeland" };
            foreach (var s in nl) d.Add(("Netherlands", "Europe", "Western Europe", "Amsterdam", "EUR", s, "NL"));

            // Sweden (21 counties)
            var se = new[] { "Blekinge","Dalarna","Gävleborg","Gotland","Halland","Jämtland","Jönköping","Kalmar","Kronoberg","Norrbotten","Örebro","Östergötland","Skåne","Södermanland","Stockholm","Uppsala","Värmland","Västerbotten","Västernorrland","Västmanland","Västra Götaland" };
            foreach (var s in se) d.Add(("Sweden", "Europe", "Northern Europe", "Stockholm", "SEK", s, "SE"));

            // Norway (11 counties)
            var no = new[] { "Agder","Innlandet","Møre og Romsdal","Nordland","Oslo","Rogaland","Troms og Finnmark","Trøndelag","Vestfold og Telemark","Vestland","Viken" };
            foreach (var s in no) d.Add(("Norway", "Europe", "Northern Europe", "Oslo", "NOK", s, "NO"));

            // Poland (16 voivodeships)
            var pl = new[] { "Greater Poland","Kuyavian-Pomeranian","Lesser Poland","Łódź","Lower Silesian","Lublin","Lubusz","Masovian","Opole","Podkarpackie","Podlaskie","Pomeranian","Silesian","Świętokrzyskie","Warmian-Masurian","West Pomeranian" };
            foreach (var s in pl) d.Add(("Poland", "Europe", "Central Europe", "Warsaw", "PLN", s, "PL"));

            // Switzerland (26 cantons)
            var ch = new[] { "Aargau","Appenzell Ausserrhoden","Appenzell Innerrhoden","Basel-Landschaft","Basel-Stadt","Bern","Fribourg","Geneva","Glarus","Graubünden","Jura","Lucerne","Neuchâtel","Nidwalden","Obwalden","Schaffhausen","Schwyz","Solothurn","St. Gallen","Thurgau","Ticino","Uri","Valais","Vaud","Zug","Zurich" };
            foreach (var s in ch) d.Add(("Switzerland", "Europe", "Western Europe", "Bern", "CHF", s, "CH"));

            // Portugal (18 districts + 2 autonomous regions)
            var pt = new[] { "Aveiro","Azores","Beja","Braga","Bragança","Castelo Branco","Coimbra","Évora","Faro","Guarda","Leiria","Lisbon","Madeira","Portalegre","Porto","Santarém","Setúbal","Viana do Castelo","Vila Real","Viseu" };
            foreach (var s in pt) d.Add(("Portugal", "Europe", "Southern Europe", "Lisbon", "EUR", s, "PT"));

            // Albania (12 counties)
            var al = new[] { "Berat","Dibër","Durrës","Elbasan","Fier","Gjirokastër","Korçë","Kukës","Lezhë","Shkodër","Tirana","Vlorë" };
            foreach (var s in al) d.Add(("Albania", "Europe", "Southern Europe", "Tirana", "ALL", s, "AL"));

            // Armenia (11 provinces)
            var am = new[] { "Aragatsotn","Ararat","Armavir","Gegharkunik","Kotayk","Lori","Shirak","Syunik","Tavush","Vayots Dzor","Yerevan" };
            foreach (var s in am) d.Add(("Armenia", "Europe", "Western Asia", "Yerevan", "AMD", s, "AM"));

            // Austria (9 states)
            var at = new[] { "Burgenland","Carinthia","Lower Austria","Salzburg","Styria","Tyrol","Upper Austria","Vienna","Vorarlberg" };
            foreach (var s in at) d.Add(("Austria", "Europe", "Western Europe", "Vienna", "EUR", s, "AT"));

            // Belgium (3 regions)
            var be = new[] { "Brussels-Capital","Flanders","Wallonia","Antwerp","East Flanders","Flemish Brabant","Hainaut","Liège","Limburg","Luxembourg","Namur","West Flanders" };
            foreach (var s in be) d.Add(("Belgium", "Europe", "Western Europe", "Brussels", "EUR", s, "BE"));

            // Bosnia and Herzegovina (2 entities + Brčko)
            var ba = new[] { "Brčko District","Federation of Bosnia and Herzegovina","Republika Srpska","Canton Sarajevo","Herzegovina-Neretva","Tuzla","Zenica-Doboj","Una-Sana" };
            foreach (var s in ba) d.Add(("Bosnia and Herzegovina", "Europe", "Southern Europe", "Sarajevo", "BAM", s, "BA"));

            // Bulgaria (28 provinces — major ones)
            var bg = new[] { "Blagoevgrad","Burgas","Dobrich","Gabrovo","Lovech","Montana","Pazardzhik","Pernik","Pleven","Plovdiv","Ruse","Shumen","Sliven","Smolyan","Sofia City","Sofia Province","Stara Zagora","Varna","Veliko Tarnovo","Vidin","Vratsa","Yambol" };
            foreach (var s in bg) d.Add(("Bulgaria", "Europe", "Eastern Europe", "Sofia", "BGN", s, "BG"));

            // Croatia (21 counties)
            var hr = new[] { "Bjelovar-Bilogora","Brod-Posavina","Dubrovnik-Neretva","Istria","Karlovac","Koprivnica-Križevci","Krapina-Zagorje","Lika-Senj","Međimurje","Osijek-Baranja","Požega-Slavonia","Primorje-Gorski Kotar","Šibenik-Knin","Sisak-Moslavina","Split-Dalmatia","Varaždin","Virovitica-Podravina","Vukovar-Srijem","Zadar","Zagreb","Zagreb County" };
            foreach (var s in hr) d.Add(("Croatia", "Europe", "Southern Europe", "Zagreb", "EUR", s, "HR"));

            // Cyprus (6 districts)
            var cy = new[] { "Famagusta","Kyrenia","Larnaca","Limassol","Nicosia","Paphos" };
            foreach (var s in cy) d.Add(("Cyprus", "Europe", "Southern Europe", "Nicosia", "EUR", s, "CY"));

            // Czechia (13 regions + Prague)
            var cz = new[] { "Central Bohemian","Hradec Králové","Karlovy Vary","Liberec","Moravian-Silesian","Olomouc","Pardubice","Plzeň","Prague","South Bohemian","South Moravian","Ústí nad Labem","Vysočina","Zlín" };
            foreach (var s in cz) d.Add(("Czechia", "Europe", "Central Europe", "Prague", "CZK", s, "CZ"));

            // Denmark (5 regions)
            var dk = new[] { "Capital Region","Central Denmark","North Denmark","Region Zealand","Southern Denmark" };
            foreach (var s in dk) d.Add(("Denmark", "Europe", "Northern Europe", "Copenhagen", "DKK", s, "DK"));

            // Estonia (15 counties)
            var ee = new[] { "Harju","Hiiu","Ida-Viru","Järva","Jõgeva","Lääne","Lääne-Viru","Pärnu","Põlva","Rapla","Saare","Tartu","Valga","Viljandi","Võru" };
            foreach (var s in ee) d.Add(("Estonia", "Europe", "Northern Europe", "Tallinn", "EUR", s, "EE"));

            // Finland (19 regions)
            var fi = new[] { "Central Finland","Central Ostrobothnia","Kainuu","Kanta-Häme","Kymenlaakso","Lapland","North Karelia","North Ostrobothnia","North Savo","Ostrobothnia","Päijät-Häme","Pirkanmaa","Satakunta","South Karelia","South Ostrobothnia","South Savo","Southwest Finland","Uusimaa","Åland" };
            foreach (var s in fi) d.Add(("Finland", "Europe", "Northern Europe", "Helsinki", "EUR", s, "FI"));

            // Greece (13 regions)
            var gr = new[] { "Attica","Central Greece","Central Macedonia","Crete","East Macedonia and Thrace","Epirus","Ionian Islands","North Aegean","Peloponnese","South Aegean","Thessaly","West Greece","West Macedonia" };
            foreach (var s in gr) d.Add(("Greece", "Europe", "Southern Europe", "Athens", "EUR", s, "GR"));

            // Hungary (19 counties + Budapest)
            var hu = new[] { "Baranya","Bács-Kiskun","Békés","Borsod-Abaúj-Zemplén","Budapest","Csongrád-Csanád","Fejér","Győr-Moson-Sopron","Hajdú-Bihar","Heves","Jász-Nagykun-Szolnok","Komárom-Esztergom","Nógrád","Pest","Somogy","Szabolcs-Szatmár-Bereg","Tolna","Vas","Veszprém","Zala" };
            foreach (var s in hu) d.Add(("Hungary", "Europe", "Central Europe", "Budapest", "HUF", s, "HU"));

            // Iceland (8 regions)
            var isl = new[] { "Capital Region","Northeast","Northwest","South","Southern Peninsula","Vestfjords","East","Westfjords" };
            foreach (var s in isl) d.Add(("Iceland", "Europe", "Northern Europe", "Reykjavik", "ISK", s, "IS"));

            // Ireland (4 provinces / 26 counties)
            var ie = new[] { "Carlow","Cavan","Clare","Cork","Donegal","Dublin","Galway","Kerry","Kildare","Kilkenny","Laois","Leitrim","Limerick","Longford","Louth","Mayo","Meath","Monaghan","Offaly","Roscommon","Sligo","Tipperary","Waterford","Westmeath","Wexford","Wicklow" };
            foreach (var s in ie) d.Add(("Ireland", "Europe", "Northern Europe", "Dublin", "EUR", s, "IE"));

            // Kosovo (7 districts)
            var xk = new[] { "Ferizaj","Gjakova","Gjilan","Mitrovica","Peja","Pristina","Prizren" };
            foreach (var s in xk) d.Add(("Kosovo", "Europe", "Southern Europe", "Pristina", "EUR", s, "XK"));

            // Latvia (43 municipalities — major ones)
            var lv = new[] { "Daugavpils","Jelgava","Jūrmala","Liepāja","Rēzekne","Riga","Valmiera","Ventspils","Cēsis","Ogre","Tukums","Sigulda" };
            foreach (var s in lv) d.Add(("Latvia", "Europe", "Northern Europe", "Riga", "EUR", s, "LV"));

            // Lithuania (10 counties)
            var lt = new[] { "Alytus","Kaunas","Klaipėda","Marijampolė","Panevėžys","Šiauliai","Tauragė","Telšiai","Utena","Vilnius" };
            foreach (var s in lt) d.Add(("Lithuania", "Europe", "Northern Europe", "Vilnius", "EUR", s, "LT"));

            // Luxembourg (12 cantons)
            var lu = new[] { "Capellen","Clervaux","Diekirch","Echternach","Esch-sur-Alzette","Grevenmacher","Luxembourg","Mersch","Redange","Remich","Vianden","Wiltz" };
            foreach (var s in lu) d.Add(("Luxembourg", "Europe", "Western Europe", "Luxembourg", "EUR", s, "LU"));

            // Malta (5 regions)
            var mt = new[] { "Gozo","Northern","Northern Harbour","South Eastern","Southern Harbour","Western" };
            foreach (var s in mt) d.Add(("Malta", "Europe", "Southern Europe", "Valletta", "EUR", s, "MT"));

            // Moldova (32 districts — major ones)
            var md = new[] { "Bălți","Cahul","Chișinău","Comrat","Edineț","Găgăuzia","Hîncești","Orhei","Soroca","Tiraspol","Transnistria","Ungheni" };
            foreach (var s in md) d.Add(("Moldova", "Europe", "Eastern Europe", "Chișinău", "MDL", s, "MD"));

            // Montenegro (24 municipalities — major ones)
            var me = new[] { "Bar","Berane","Bijelo Polje","Budva","Cetinje","Herceg Novi","Kotor","Nikšić","Pljevlja","Podgorica","Tivat","Ulcinj" };
            foreach (var s in me) d.Add(("Montenegro", "Europe", "Southern Europe", "Podgorica", "EUR", s, "ME"));

            // North Macedonia (8 statistical regions)
            var mk = new[] { "East","Northeast","Pelagonia","Polog","Skopje","Southeast","Southwest","Vardar" };
            foreach (var s in mk) d.Add(("North Macedonia", "Europe", "Southern Europe", "Skopje", "MKD", s, "MK"));

            // Romania (41 counties + Bucharest)
            var ro = new[] { "Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","Bucharest","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Satu Mare","Sălaj","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea" };
            foreach (var s in ro) d.Add(("Romania", "Europe", "Eastern Europe", "Bucharest", "RON", s, "RO"));

            // Serbia (25 districts — major ones)
            var rs = new[] { "Belgrade","Bor","Jablanica","Kolubara","Mačva","Moravica","Nišava","Pirot","Podunavlje","Pomoravlje","Rasina","Raška","South Bačka","South Banat","Srem","Šumadija","Toplica","West Bačka","Zlatibor" };
            foreach (var s in rs) d.Add(("Serbia", "Europe", "Southern Europe", "Belgrade", "RSD", s, "RS"));

            // Slovak Republic (8 regions)
            var sk = new[] { "Banská Bystrica","Bratislava","Košice","Nitra","Prešov","Trenčín","Trnava","Žilina" };
            foreach (var s in sk) d.Add(("Slovak Republic", "Europe", "Central Europe", "Bratislava", "EUR", s, "SK"));

            // Slovenia (12 statistical regions)
            var si = new[] { "Carinthia","Central Sava","Central Slovenia","Coastal-Karst","Drava","Goriška","Inner Carniola-Karst","Littoral-Inner Carniola","Lower Sava","Mura","Podravska","Savinjska","Southeast Slovenia","Upper Carniola" };
            foreach (var s in si) d.Add(("Slovenia", "Europe", "Southern Europe", "Ljubljana", "EUR", s, "SI"));

            // Ukraine (24 oblasts + Crimea + Kyiv + Sevastopol)
            var ua = new[] { "Cherkasy","Chernihiv","Chernivtsi","Crimea","Dnipropetrovsk","Donetsk","Ivano-Frankivsk","Kharkiv","Kherson","Khmelnytskyi","Kirovohrad","Kyiv","Kyiv City","Luhansk","Lviv","Mykolaiv","Odesa","Poltava","Rivne","Sevastopol","Sumy","Ternopil","Vinnytsia","Volyn","Zakarpattia","Zaporizhzhia","Zhytomyr" };
            foreach (var s in ua) d.Add(("Ukraine", "Europe", "Eastern Europe", "Kyiv", "UAH", s, "UA"));

            return d;
        }

        // ═══════════════════════════════════════════════════════
        //  NORTH & CENTRAL AMERICA
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetNorthAmerica()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // United States (50 states + DC)
            var us = new[] { "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming" };
            foreach (var s in us) d.Add(("United States", "Americas", "Northern America", "Washington D.C.", "USD", s, "US"));

            // Canada (13 provinces/territories)
            var ca = new[] { "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon" };
            foreach (var s in ca) d.Add(("Canada", "Americas", "Northern America", "Ottawa", "CAD", s, "CA"));

            // Mexico (32 states)
            var mx = new[] { "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México","Mexico City","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas" };
            foreach (var s in mx) d.Add(("Mexico", "Americas", "Central America", "Mexico City", "MXN", s, "MX"));

            // Costa Rica (7 provinces)
            var cr = new[] { "Alajuela","Cartago","Guanacaste","Heredia","Limón","Puntarenas","San José" };
            foreach (var s in cr) d.Add(("Costa Rica", "Americas", "Central America", "San José", "CRC", s, "CR"));

            // Dominican Republic (31 provinces + DN)
            var dom = new[] { "Azua","Bahoruco","Barahona","Dajabón","Distrito Nacional","Duarte","El Seibo","Elías Piña","Espaillat","Hato Mayor","Hermanas Mirabal","Independencia","La Altagracia","La Romana","La Vega","María Trinidad Sánchez","Monseñor Nouel","Monte Cristi","Monte Plata","Pedernales","Peravia","Puerto Plata","Samaná","San Cristóbal","San José de Ocoa","San Juan","San Pedro de Macorís","Sánchez Ramírez","Santiago","Santiago Rodríguez","Santo Domingo","Valverde" };
            foreach (var s in dom) d.Add(("Dominican Republic", "Americas", "Caribbean", "Santo Domingo", "DOP", s, "DO"));

            // Ecuador (24 provinces)
            var ec = new[] { "Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi","El Oro","Esmeraldas","Galápagos","Guayas","Imbabura","Loja","Los Ríos","Manabí","Morona Santiago","Napo","Orellana","Pastaza","Pichincha","Santa Elena","Santo Domingo","Sucumbíos","Tungurahua","Zamora Chinchipe" };
            foreach (var s in ec) d.Add(("Ecuador", "Americas", "South America", "Quito", "USD", s, "EC"));

            // El Salvador (14 departments)
            var sv = new[] { "Ahuachapán","Cabañas","Chalatenango","Cuscatlán","La Libertad","La Paz","La Unión","Morazán","San Miguel","San Salvador","San Vicente","Santa Ana","Sonsonate","Usulután" };
            foreach (var s in sv) d.Add(("El Salvador", "Americas", "Central America", "San Salvador", "USD", s, "SV"));

            // Guatemala (22 departments)
            var gt = new[] { "Alta Verapaz","Baja Verapaz","Chimaltenango","Chiquimula","El Progreso","Escuintla","Guatemala","Huehuetenango","Izabal","Jalapa","Jutiapa","Petén","Quetzaltenango","Quiché","Retalhuleu","Sacatepéquez","San Marcos","Santa Rosa","Sololá","Suchitepéquez","Totonicapán","Zacapa" };
            foreach (var s in gt) d.Add(("Guatemala", "Americas", "Central America", "Guatemala City", "GTQ", s, "GT"));

            // Haiti (10 departments)
            var ht = new[] { "Artibonite","Centre","Grand'Anse","Nippes","Nord","Nord-Est","Nord-Ouest","Ouest","Sud","Sud-Est" };
            foreach (var s in ht) d.Add(("Haiti", "Americas", "Caribbean", "Port-au-Prince", "HTG", s, "HT"));

            // Honduras (18 departments)
            var hn = new[] { "Atlántida","Choluteca","Colón","Comayagua","Copán","Cortés","El Paraíso","Francisco Morazán","Gracias a Dios","Intibucá","Islas de la Bahía","La Paz","Lempira","Ocotepeque","Olancho","Santa Bárbara","Valle","Yoro" };
            foreach (var s in hn) d.Add(("Honduras", "Americas", "Central America", "Tegucigalpa", "HNL", s, "HN"));

            // Jamaica (14 parishes)
            var jm = new[] { "Clarendon","Hanover","Kingston","Manchester","Portland","Saint Andrew","Saint Ann","Saint Catherine","Saint Elizabeth","Saint James","Saint Mary","Saint Thomas","Trelawny","Westmoreland" };
            foreach (var s in jm) d.Add(("Jamaica", "Americas", "Caribbean", "Kingston", "JMD", s, "JM"));

            // Nicaragua (15 departments + 2 autonomous regions)
            var ni = new[] { "Boaco","Carazo","Chinandega","Chontales","Costa Caribe Norte","Costa Caribe Sur","Estelí","Granada","Jinotega","León","Madriz","Managua","Masaya","Matagalpa","Nueva Segovia","Río San Juan","Rivas" };
            foreach (var s in ni) d.Add(("Nicaragua", "Americas", "Central America", "Managua", "NIO", s, "NI"));

            // Panama (10 provinces + 3 comarcas)
            var pa = new[] { "Bocas del Toro","Chiriquí","Coclé","Colón","Darién","Emberá-Wounaan","Guna Yala","Herrera","Los Santos","Ngäbe-Buglé","Panamá","Panamá Oeste","Veraguas" };
            foreach (var s in pa) d.Add(("Panama", "Americas", "Central America", "Panama City", "USD", s, "PA"));

            // Paraguay (17 departments + Asunción)
            var py = new[] { "Alto Paraná","Alto Paraguay","Amambay","Asunción","Boquerón","Caaguazú","Caazapá","Canindeyú","Central","Concepción","Cordillera","Guairá","Itapúa","Misiones","Ñeembucú","Paraguarí","Presidente Hayes","San Pedro" };
            foreach (var s in py) d.Add(("Paraguay", "Americas", "South America", "Asunción", "PYG", s, "PY"));

            // Uruguay (19 departments)
            var uy = new[] { "Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres" };
            foreach (var s in uy) d.Add(("Uruguay", "Americas", "South America", "Montevideo", "UYU", s, "UY"));

            // Venezuela (23 states + Capital District)
            var ve = new[] { "Amazonas","Anzoátegui","Apure","Aragua","Barinas","Bolívar","Carabobo","Capital District","Cojedes","Delta Amacuro","Falcón","Guárico","Lara","Mérida","Miranda","Monagas","Nueva Esparta","Portuguesa","Sucre","Táchira","Trujillo","Vargas","Yaracuy","Zulia" };
            foreach (var s in ve) d.Add(("Venezuela", "Americas", "South America", "Caracas", "VES", s, "VE"));

            // Bolivia (9 departments)
            var bo = new[] { "Beni","Chuquisaca","Cochabamba","La Paz","Oruro","Pando","Potosí","Santa Cruz","Tarija" };
            foreach (var s in bo) d.Add(("Bolivia", "Americas", "South America", "Sucre", "BOB", s, "BO"));

            return d;
        }

        // ═══════════════════════════════════════════════════════
        //  SOUTH AMERICA
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetSouthAmerica()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // Brazil (27 states)
            var br = new[] { "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins" };
            foreach (var s in br) d.Add(("Brazil", "Americas", "South America", "Brasília", "BRL", s, "BR"));

            // Argentina (23 provinces + CABA)
            var ar = new[] { "Buenos Aires","Buenos Aires City","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán" };
            foreach (var s in ar) d.Add(("Argentina", "Americas", "South America", "Buenos Aires", "ARS", s, "AR"));

            // Colombia (32 departments + Bogotá)
            var co = new[] { "Amazonas","Antioquia","Arauca","Atlántico","Bogotá","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada" };
            foreach (var s in co) d.Add(("Colombia", "Americas", "South America", "Bogotá", "COP", s, "CO"));

            // Chile (16 regions)
            var cl = new[] { "Antofagasta","Arica y Parinacota","Atacama","Aysén","Biobío","Coquimbo","La Araucanía","Libertador General Bernardo O'Higgins","Los Lagos","Los Ríos","Magallanes","Maule","Ñuble","Santiago Metropolitan","Tarapacá","Valparaíso" };
            foreach (var s in cl) d.Add(("Chile", "Americas", "South America", "Santiago", "CLP", s, "CL"));

            // Peru (25 regions)
            var pe = new[] { "Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca","Callao","Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad","Lambayeque","Lima","Loreto","Madre de Dios","Moquegua","Pasco","Piura","Puno","San Martín","Tacna","Tumbes","Ucayali" };
            foreach (var s in pe) d.Add(("Peru", "Americas", "South America", "Lima", "PEN", s, "PE"));

            return d;
        }

        // ═══════════════════════════════════════════════════════
        //  OCEANIA
        // ═══════════════════════════════════════════════════════
        private static List<(string, string, string, string, string, string, string)> GetOceania()
        {
            var d = new List<(string, string, string, string, string, string, string)>();

            // Australia (6 states + 2 territories)
            var au = new[] { "Australian Capital Territory","New South Wales","Northern Territory","Queensland","South Australia","Tasmania","Victoria","Western Australia" };
            foreach (var s in au) d.Add(("Australia", "Oceania", "Australia and New Zealand", "Canberra", "AUD", s, "AU"));

            // New Zealand (16 regions)
            var nz = new[] { "Auckland","Bay of Plenty","Canterbury","Gisborne","Hawke's Bay","Manawatu-Wanganui","Marlborough","Nelson","Northland","Otago","Southland","Taranaki","Tasman","Waikato","Wellington","West Coast" };
            foreach (var s in nz) d.Add(("New Zealand", "Oceania", "Australia and New Zealand", "Wellington", "NZD", s, "NZ"));

            return d;
        }
    }
}
