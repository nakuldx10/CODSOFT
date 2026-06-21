import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Quiz from './models/Quiz.js';
import Attempt from './models/Attempt.js';

dotenv.config();

const usersData = [
  { name: "Rahul Sharma", email: "rahul@quizify.in", password: "test1234" },
  { name: "Priya Patel", email: "priya@quizify.in", password: "test1234" },
  { name: "Arjun Singh", email: "arjun@quizify.in", password: "test1234" }
];

const quizzesData = [
  {
    title: "General Knowledge Basics",
    description: "Test your everyday general knowledge with fun and easy questions covering a wide range of topics.",
    category: "General Knowledge",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "What is the capital city of France?", options: ["Berlin","Madrid","Paris","Rome"], correctAnswer: 2 },
      { questionText: "How many continents are there on Earth?", options: ["5","6","7","8"], correctAnswer: 2 },
      { questionText: "Which planet is known as the Red Planet?", options: ["Venus","Mars","Jupiter","Saturn"], correctAnswer: 1 },
      { questionText: "What is the largest ocean on Earth?", options: ["Atlantic","Indian","Arctic","Pacific"], correctAnswer: 3 },
      { questionText: "Who painted the Mona Lisa?", options: ["Van Gogh","Picasso","Da Vinci","Rembrandt"], correctAnswer: 2 },
      { questionText: "What is the chemical symbol for water?", options: ["WA","H2O","HO","W2O"], correctAnswer: 1 },
      { questionText: "How many days are in a leap year?", options: ["364","365","366","367"], correctAnswer: 2 },
      { questionText: "Which country is the largest by area?", options: ["USA","China","Canada","Russia"], correctAnswer: 3 },
      { questionText: "What is the speed of light approximately?", options: ["300,000 km/s","150,000 km/s","450,000 km/s","200,000 km/s"], correctAnswer: 0 },
      { questionText: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], correctAnswer: 2 }
    ]
  },
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts including data types, functions, and ES6.",
    category: "Technology",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which keyword declares a constant in JavaScript?", options: ["var","let","const","static"], correctAnswer: 2 },
      { questionText: "What does DOM stand for?", options: ["Document Object Model","Data Object Management","Document Oriented Model","Dynamic Object Module"], correctAnswer: 0 },
      { questionText: "Which method adds an element to end of an array?", options: ["push()","pop()","shift()","unshift()"], correctAnswer: 0 },
      { questionText: "What is output of typeof null in JavaScript?", options: ["null","undefined","object","string"], correctAnswer: 2 },
      { questionText: "Which is used for strict equality in JavaScript?", options: ["==","=","===","!=="], correctAnswer: 2 },
      { questionText: "What does JSON stand for?", options: ["Java Syntax Object Notation","JavaScript Object Notation","Java Standard Output Node","JavaScript Online Network"], correctAnswer: 1 },
      { questionText: "Which converts JSON string to JavaScript object?", options: ["JSON.stringify()","JSON.convert()","JSON.parse()","JSON.toObject()"], correctAnswer: 2 },
      { questionText: "What is a closure in JavaScript?", options: ["A way to close the browser","Function that remembers outer scope variables","A method to end a loop","A type of error handling"], correctAnswer: 1 },
      { questionText: "Which is NOT a JavaScript data type?", options: ["Boolean","Float","Symbol","BigInt"], correctAnswer: 1 },
      { questionText: "What does async/await do in JavaScript?", options: ["Handles synchronous code only","Makes asynchronous code look synchronous","Creates new threads","Blocks the event loop"], correctAnswer: 1 }
    ]
  },
  {
    title: "World Geography Challenge",
    description: "Explore countries, capitals, rivers, mountains and everything geography around the world.",
    category: "Geography",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which is the longest river in the world?", options: ["Amazon","Yangtze","Nile","Mississippi"], correctAnswer: 2 },
      { questionText: "Which country has the most natural lakes?", options: ["USA","Russia","Canada","Brazil"], correctAnswer: 2 },
      { questionText: "What is the capital of Australia?", options: ["Sydney","Melbourne","Brisbane","Canberra"], correctAnswer: 3 },
      { questionText: "Which is the smallest country in the world?", options: ["Monaco","San Marino","Vatican City","Liechtenstein"], correctAnswer: 2 },
      { questionText: "Mount Everest is in which mountain range?", options: ["Andes","Alps","Rockies","Himalayas"], correctAnswer: 3 },
      { questionText: "Which desert is the largest in the world?", options: ["Sahara","Arabian","Gobi","Antarctic"], correctAnswer: 3 },
      { questionText: "Which country has the longest coastline?", options: ["Australia","USA","Canada","Norway"], correctAnswer: 2 },
      { questionText: "What is the capital of Japan?", options: ["Osaka","Kyoto","Tokyo","Hiroshima"], correctAnswer: 2 },
      { questionText: "Which continent is the Sahara Desert located in?", options: ["Asia","Australia","South America","Africa"], correctAnswer: 3 },
      { questionText: "Which ocean lies between Africa and Australia?", options: ["Atlantic","Pacific","Indian","Arctic"], correctAnswer: 2 }
    ]
  },
  {
    title: "Ancient World History",
    description: "Journey through ancient civilizations, empires, and key historical events that shaped humanity.",
    category: "History",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which ancient wonder still exists today?", options: ["Hanging Gardens of Babylon","Colossus of Rhodes","Great Pyramid of Giza","Lighthouse of Alexandria"], correctAnswer: 2 },
      { questionText: "Who was the first Emperor of Rome?", options: ["Julius Caesar","Nero","Augustus","Caligula"], correctAnswer: 2 },
      { questionText: "Which civilization built Machu Picchu?", options: ["Aztec","Maya","Olmec","Inca"], correctAnswer: 3 },
      { questionText: "In which year did World War II end?", options: ["1943","1944","1945","1946"], correctAnswer: 2 },
      { questionText: "Who was the first person to walk on the moon?", options: ["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","John Glenn"], correctAnswer: 2 },
      { questionText: "Which empire was the largest in history?", options: ["Roman Empire","British Empire","Mongol Empire","Ottoman Empire"], correctAnswer: 1 },
      { questionText: "Who invented the printing press?", options: ["Leonardo da Vinci","Johannes Gutenberg","Isaac Newton","Galileo Galilei"], correctAnswer: 1 },
      { questionText: "The French Revolution began in which year?", options: ["1776","1783","1789","1799"], correctAnswer: 2 },
      { questionText: "Which country was Adolf Hitler born in?", options: ["Germany","Switzerland","Austria","Poland"], correctAnswer: 2 },
      { questionText: "Who wrote the Communist Manifesto?", options: ["Lenin and Stalin","Marx and Engels","Mao and Stalin","Trotsky and Lenin"], correctAnswer: 1 }
    ]
  },
  {
    title: "Human Body Science",
    description: "How well do you know the human body? Test your biology and anatomy knowledge here.",
    category: "Science",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "How many bones are in the adult human body?", options: ["196","206","216","226"], correctAnswer: 1 },
      { questionText: "Which is the largest organ in the human body?", options: ["Liver","Brain","Skin","Heart"], correctAnswer: 2 },
      { questionText: "How many chambers does the human heart have?", options: ["2","3","4","5"], correctAnswer: 2 },
      { questionText: "Which blood type is the universal donor?", options: ["A+","B+","AB+","O-"], correctAnswer: 3 },
      { questionText: "What is the powerhouse of the cell?", options: ["Nucleus","Ribosome","Mitochondria","Golgi body"], correctAnswer: 2 },
      { questionText: "How many teeth does a healthy adult have?", options: ["28","30","32","34"], correctAnswer: 2 },
      { questionText: "Which vitamin is produced by sunlight?", options: ["Vitamin A","Vitamin B","Vitamin C","Vitamin D"], correctAnswer: 3 },
      { questionText: "What is the normal human body temperature in Celsius?", options: ["35°C","36°C","37°C","38°C"], correctAnswer: 2 },
      { questionText: "Which organ produces insulin in the human body?", options: ["Liver","Kidney","Pancreas","Spleen"], correctAnswer: 2 },
      { questionText: "How many pairs of chromosomes do humans have?", options: ["21","22","23","24"], correctAnswer: 2 }
    ]
  },
  {
    title: "Cricket World Cup Trivia",
    description: "Think you know cricket? Test your knowledge of Cricket World Cup history, players and records.",
    category: "Sports",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which country has won the most Cricket World Cups?", options: ["India","Sri Lanka","West Indies","Australia"], correctAnswer: 3 },
      { questionText: "Who holds the record for most runs in World Cup history?", options: ["Ricky Ponting","Sachin Tendulkar","Brian Lara","Kumar Sangakkara"], correctAnswer: 1 },
      { questionText: "In which year did India win their first Cricket World Cup?", options: ["1979","1983","1987","1992"], correctAnswer: 1 },
      { questionText: "What is the maximum number of overs in ODI cricket?", options: ["40","45","50","55"], correctAnswer: 2 },
      { questionText: "Which bowler took the first hat-trick in World Cup?", options: ["Wasim Akram","Chetan Sharma","Brett Lee","Shoaib Akhtar"], correctAnswer: 1 },
      { questionText: "Where was the first Cricket World Cup held in 1975?", options: ["Australia","West Indies","England","India"], correctAnswer: 2 },
      { questionText: "Who was the captain of India in the 2011 World Cup?", options: ["Sourav Ganguly","Rahul Dravid","MS Dhoni","Virat Kohli"], correctAnswer: 2 },
      { questionText: "Which team scored the highest total in World Cup history?", options: ["India","South Africa","England","Australia"], correctAnswer: 2 },
      { questionText: "What does LBW stand for in cricket?", options: ["Left Bat Wicket","Leg Before Wicket","Long Ball Wide","Low Bat Width"], correctAnswer: 1 },
      { questionText: "Who won the 2019 Cricket World Cup?", options: ["India","Australia","New Zealand","England"], correctAnswer: 3 }
    ]
  },
  {
    title: "Basic Mathematics",
    description: "Sharpen your math skills with questions on arithmetic, algebra, geometry, and number theory.",
    category: "Mathematics",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "What is the value of Pi (π) approximately?", options: ["3.14","3.41","3.12","3.16"], correctAnswer: 0 },
      { questionText: "What is the square root of 144?", options: ["11","12","13","14"], correctAnswer: 1 },
      { questionText: "What is 15% of 200?", options: ["25","30","35","40"], correctAnswer: 1 },
      { questionText: "How many sides does a hexagon have?", options: ["5","6","7","8"], correctAnswer: 1 },
      { questionText: "What is 2 to the power of 10?", options: ["512","1024","2048","256"], correctAnswer: 1 },
      { questionText: "What is the sum of angles in a triangle?", options: ["90°","120°","180°","360°"], correctAnswer: 2 },
      { questionText: "What is the LCM of 4 and 6?", options: ["8","10","12","16"], correctAnswer: 2 },
      { questionText: "Which is a prime number?", options: ["21","25","29","33"], correctAnswer: 2 },
      { questionText: "What is 3/4 as a percentage?", options: ["55%","65%","70%","75%"], correctAnswer: 3 },
      { questionText: "What is the area of a circle with radius 7? (Use π = 22/7)", options: ["144","154","164","174"], correctAnswer: 1 }
    ]
  },
  {
    title: "React.js Essentials",
    description: "Do you really know React? Test your knowledge of hooks, components, state and props.",
    category: "Technology",
    difficulty: "Hard",
    isPublished: true,
    questions: [
      { questionText: "Which hook is used to manage state in functional components?", options: ["useEffect","useContext","useState","useReducer"], correctAnswer: 2 },
      { questionText: "What does the useEffect hook with empty dependency array [] do?", options: ["Runs on every render","Runs only on first render","Runs only on unmount","Never runs"], correctAnswer: 1 },
      { questionText: "What is the virtual DOM in React?", options: ["A real browser DOM","A lightweight copy of real DOM","A server-side rendering tool","A database of components"], correctAnswer: 1 },
      { questionText: "Which method is called when a React component is removed from the DOM?", options: ["componentDidMount","componentDidUpdate","componentWillUnmount","componentWillMount"], correctAnswer: 2 },
      { questionText: "What is the correct way to pass data from parent to child in React?", options: ["State","Context","Props","Redux"], correctAnswer: 2 },
      { questionText: "What does React.memo do?", options: ["Memoizes function return values","Prevents re-render if props unchanged","Creates a memory snapshot","Stores component in localStorage"], correctAnswer: 1 },
      { questionText: "Which is the correct way to update state based on previous state?", options: ["setState(state + 1)","setState(prev => prev + 1)","state = state + 1","updateState(state + 1)"], correctAnswer: 1 },
      { questionText: "What is JSX in React?", options: ["A JavaScript library","A database query language","JavaScript XML syntax extension","A styling framework"], correctAnswer: 2 },
      { questionText: "Which hook is used for side effects in React?", options: ["useState","useCallback","useMemo","useEffect"], correctAnswer: 3 },
      { questionText: "What is the purpose of key prop in React lists?", options: ["To style list items","To encrypt list data","To help React identify which items changed","To sort list items"], correctAnswer: 2 }
    ]
  },
  {
    title: "Space and Universe",
    description: "Explore the cosmos! Test your knowledge of planets, stars, galaxies and space exploration.",
    category: "Science",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which is the largest planet in our solar system?", options: ["Saturn","Neptune","Uranus","Jupiter"], correctAnswer: 3 },
      { questionText: "How long does light take to travel from Sun to Earth?", options: ["4 minutes","8 minutes","12 minutes","16 minutes"], correctAnswer: 1 },
      { questionText: "What is the name of our galaxy?", options: ["Andromeda","Triangulum","Milky Way","Sombrero"], correctAnswer: 2 },
      { questionText: "Which planet has the most moons?", options: ["Jupiter","Saturn","Uranus","Neptune"], correctAnswer: 1 },
      { questionText: "What is a light year a measure of?", options: ["Time","Speed","Distance","Mass"], correctAnswer: 2 },
      { questionText: "Who was the first human to travel to space?", options: ["Neil Armstrong","Alan Shepard","Yuri Gagarin","Buzz Aldrin"], correctAnswer: 2 },
      { questionText: "What is the closest star to our solar system?", options: ["Sirius","Proxima Centauri","Betelgeuse","Vega"], correctAnswer: 1 },
      { questionText: "How many planets are in our solar system?", options: ["7","8","9","10"], correctAnswer: 1 },
      { questionText: "What causes a solar eclipse?", options: ["Earth passes between Moon and Sun","Moon passes between Earth and Sun","Sun passes between Earth and Moon","Earth moves away from Sun"], correctAnswer: 1 },
      { questionText: "Which space telescope was launched in 1990?", options: ["James Webb","Spitzer","Hubble","Chandra"], correctAnswer: 2 }
    ]
  },
  {
    title: "Bollywood Blockbusters",
    description: "How well do you know Bollywood? Test your knowledge of hit films, actors and directors.",
    category: "Entertainment",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "Which film features the song 'Jai Ho'?", options: ["Lagaan","Dilwale Dulhania Le Jayenge","Slumdog Millionaire","Rang De Basanti"], correctAnswer: 2 },
      { questionText: "Who directed the film '3 Idiots'?", options: ["Karan Johar","Rajkumar Hirani","Sanjay Leela Bhansali","Farhan Akhtar"], correctAnswer: 1 },
      { questionText: "Which actor played the role of Munna Bhai?", options: ["Shah Rukh Khan","Salman Khan","Sanjay Dutt","Aamir Khan"], correctAnswer: 2 },
      { questionText: "Which Bollywood film won the Oscar for Best Picture?", options: ["Lagaan","Mother India","No Bollywood film has won","Mughal-E-Azam"], correctAnswer: 2 },
      { questionText: "Who is known as the King of Bollywood?", options: ["Amitabh Bachchan","Salman Khan","Aamir Khan","Shah Rukh Khan"], correctAnswer: 3 },
      { questionText: "In which year was the film Sholay released?", options: ["1973","1974","1975","1976"], correctAnswer: 2 },
      { questionText: "Which film has the famous dialogue 'Mogambo Khush Hua'?", options: ["Sholay","Mr. India","Deewar","Agneepath"], correctAnswer: 1 },
      { questionText: "Who composed the music for the film Dilwale Dulhania Le Jayenge?", options: ["A.R. Rahman","Laxmikant Pyarelal","Jatin-Lalit","Shankar Ehsaan Loy"], correctAnswer: 2 },
      { questionText: "Which actress starred in the film Queen (2014)?", options: ["Deepika Padukone","Priyanka Chopra","Kangana Ranaut","Anushka Sharma"], correctAnswer: 2 },
      { questionText: "Which film features the character 'Chulbul Pandey'?", options: ["Wanted","Dabangg","Kick","Sultan"], correctAnswer: 1 }
    ]
  },
  {
    title: "English Grammar Master",
    description: "Test your command over English grammar rules, tenses, vocabulary and sentence structure.",
    category: "Language",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which sentence is grammatically correct?", options: ["She don't like coffee","She doesn't likes coffee","She doesn't like coffee","She not like coffee"], correctAnswer: 2 },
      { questionText: "What is the plural of 'criterion'?", options: ["Criterions","Criterias","Criteria","Criterions"], correctAnswer: 2 },
      { questionText: "Which tense is used in: 'I have been working since morning'?", options: ["Simple Present","Present Perfect","Present Perfect Continuous","Past Continuous"], correctAnswer: 2 },
      { questionText: "What is an antonym of 'benevolent'?", options: ["Kind","Generous","Malevolent","Peaceful"], correctAnswer: 2 },
      { questionText: "Which is the correct spelling?", options: ["Accomodate","Accommodate","Accommadate","Acomodate"], correctAnswer: 1 },
      { questionText: "What part of speech is the word 'quickly'?", options: ["Adjective","Noun","Verb","Adverb"], correctAnswer: 3 },
      { questionText: "Which sentence uses the Oxford comma correctly?", options: ["I like cats dogs and birds","I like cats, dogs, and birds","I like cats, dogs and, birds","I like, cats, dogs and birds"], correctAnswer: 1 },
      { questionText: "What is a synonym of 'ephemeral'?", options: ["Permanent","Transient","Eternal","Consistent"], correctAnswer: 1 },
      { questionText: "Which is a compound sentence?", options: ["She runs fast","Although it rained we went out","I like tea but she likes coffee","The tall dark man walked away"], correctAnswer: 2 },
      { questionText: "What does the idiom 'break a leg' mean?", options: ["Get injured","Good luck","Work hard","Run fast"], correctAnswer: 1 }
    ]
  },
  {
    title: "Advanced Physics",
    description: "Challenge yourself with questions on mechanics, waves, thermodynamics and modern physics.",
    category: "Science",
    difficulty: "Hard",
    isPublished: true,
    questions: [
      { questionText: "What is Newton's Second Law of Motion?", options: ["Every action has equal reaction","An object at rest stays at rest","Force equals mass times acceleration","Energy cannot be created or destroyed"], correctAnswer: 2 },
      { questionText: "What is the unit of electric resistance?", options: ["Ampere","Volt","Ohm","Watt"], correctAnswer: 2 },
      { questionText: "Which particle has no electric charge?", options: ["Proton","Electron","Neutron","Positron"], correctAnswer: 2 },
      { questionText: "What is the formula for kinetic energy?", options: ["mgh","mv","½mv²","Fd"], correctAnswer: 2 },
      { questionText: "What phenomenon explains the bending of light around massive objects?", options: ["Refraction","Diffraction","Gravitational lensing","Total internal reflection"], correctAnswer: 2 },
      { questionText: "Which scientist proposed the theory of special relativity?", options: ["Isaac Newton","Niels Bohr","Albert Einstein","Max Planck"], correctAnswer: 2 },
      { questionText: "What is absolute zero in Celsius?", options: ["-173°C","-223°C","-273°C","-323°C"], correctAnswer: 2 },
      { questionText: "What does E=mc² represent?", options: ["Gravity equation","Mass-energy equivalence","Wave-particle duality","Quantum superposition"], correctAnswer: 1 },
      { questionText: "What type of wave is sound?", options: ["Transverse wave","Electromagnetic wave","Longitudinal wave","Surface wave"], correctAnswer: 2 },
      { questionText: "Which law states that energy cannot be created or destroyed?", options: ["Newton's First Law","Second Law of Thermodynamics","First Law of Thermodynamics","Ohm's Law"], correctAnswer: 2 }
    ]
  },
  {
    title: "Indian History & Culture",
    description: "Test your knowledge about India's rich history, freedom struggle, culture and heritage.",
    category: "History",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "Who is known as the Father of the Indian Nation?", options: ["Jawaharlal Nehru","Bhagat Singh","Mahatma Gandhi","Subhas Chandra Bose"], correctAnswer: 2 },
      { questionText: "In which year did India gain independence?", options: ["1945","1946","1947","1948"], correctAnswer: 2 },
      { questionText: "Who was the first Prime Minister of India?", options: ["Sardar Patel","Jawaharlal Nehru","Rajendra Prasad","Lal Bahadur Shastri"], correctAnswer: 1 },
      { questionText: "Which is the national animal of India?", options: ["Lion","Elephant","Bengal Tiger","Peacock"], correctAnswer: 2 },
      { questionText: "The Taj Mahal is located in which city?", options: ["Delhi","Jaipur","Lucknow","Agra"], correctAnswer: 3 },
      { questionText: "Which Indian leader gave the speech 'Tryst with Destiny'?", options: ["Mahatma Gandhi","Sardar Patel","Jawaharlal Nehru","B.R. Ambedkar"], correctAnswer: 2 },
      { questionText: "How many states are there in India as of 2024?", options: ["27","28","29","30"], correctAnswer: 1 },
      { questionText: "Which river is considered the holiest in India?", options: ["Yamuna","Brahmaputra","Godavari","Ganga"], correctAnswer: 3 },
      { questionText: "Who designed the Indian National Flag?", options: ["Rabindranath Tagore","Pingali Venkayya","Mahatma Gandhi","Jawaharlal Nehru"], correctAnswer: 1 },
      { questionText: "What is the national sport of India?", options: ["Cricket","Football","Kabaddi","Hockey"], correctAnswer: 3 }
    ]
  },
  {
    title: "Python Programming",
    description: "Test your Python skills from basics to advanced topics like OOP, libraries and syntax.",
    category: "Technology",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Which keyword is used to define a function in Python?", options: ["function","fun","def","define"], correctAnswer: 2 },
      { questionText: "What data type is the result of: type([]) ?", options: ["tuple","dict","set","list"], correctAnswer: 3 },
      { questionText: "Which operator is used for floor division in Python?", options: ["/","//","%","**"], correctAnswer: 1 },
      { questionText: "What is the output of len('Hello World')?", options: ["10","11","12","9"], correctAnswer: 1 },
      { questionText: "Which method removes whitespace from both ends of a string?", options: ["strip()","trim()","clean()","remove()"], correctAnswer: 0 },
      { questionText: "What does PEP 8 refer to in Python?", options: ["Python Error Protocol 8","Python Enhancement Proposal 8","Python Execution Plan 8","Python Extension Package 8"], correctAnswer: 1 },
      { questionText: "Which of these is a mutable data type in Python?", options: ["tuple","string","list","int"], correctAnswer: 2 },
      { questionText: "What is the correct way to create a virtual environment in Python?", options: ["python -env create myenv","python -m venv myenv","python create-env myenv","pip install venv myenv"], correctAnswer: 1 },
      { questionText: "What is a lambda function in Python?", options: ["A function with no return value","A function defined in a class","An anonymous single expression function","A recursive function"], correctAnswer: 2 },
      { questionText: "Which library is used for data manipulation in Python?", options: ["NumPy","Matplotlib","Pandas","Seaborn"], correctAnswer: 2 }
    ]
  },
  {
    title: "FIFA World Cup History",
    description: "How much do you know about the FIFA World Cup? Test your football knowledge from 1930 to present.",
    category: "Sports",
    difficulty: "Hard",
    isPublished: true,
    questions: [
      { questionText: "Which country won the first FIFA World Cup in 1930?", options: ["Brazil","Argentina","Uruguay","Italy"], correctAnswer: 2 },
      { questionText: "Who has scored the most goals in World Cup history?", options: ["Ronaldo (Brazil)","Miroslav Klose","Gerd Muller","Pele"], correctAnswer: 1 },
      { questionText: "Which country has won the most World Cups?", options: ["Germany","Italy","Argentina","Brazil"], correctAnswer: 3 },
      { questionText: "Where was the 2022 FIFA World Cup held?", options: ["UAE","Saudi Arabia","Qatar","Bahrain"], correctAnswer: 2 },
      { questionText: "Who won the 2022 FIFA World Cup?", options: ["France","Brazil","Argentina","Portugal"], correctAnswer: 2 },
      { questionText: "What is the nickname of the FIFA World Cup trophy?", options: ["The Golden Boot","Jules Rimet Trophy","The Golden Ball","FIFA Gold Cup"], correctAnswer: 1 },
      { questionText: "Which player won the Golden Ball at 2022 World Cup?", options: ["Kylian Mbappe","Neymar","Luka Modric","Lionel Messi"], correctAnswer: 3 },
      { questionText: "How many teams participate in the FIFA World Cup finals?", options: ["24","28","32","36"], correctAnswer: 2 },
      { questionText: "Which country hosted the 2018 FIFA World Cup?", options: ["Brazil","Russia","Germany","France"], correctAnswer: 1 },
      { questionText: "What is the maximum number of players allowed on the field per team?", options: ["9","10","11","12"], correctAnswer: 2 }
    ]
  },
  {
    title: "Computer Science Fundamentals",
    description: "Test your CS fundamentals including data structures, algorithms, networking and operating systems.",
    category: "Technology",
    difficulty: "Hard",
    isPublished: true,
    questions: [
      { questionText: "What is the time complexity of binary search?", options: ["O(n)","O(n²)","O(log n)","O(n log n)"], correctAnswer: 2 },
      { questionText: "Which data structure follows LIFO principle?", options: ["Queue","Stack","Linked List","Tree"], correctAnswer: 1 },
      { questionText: "What does HTTP stand for?", options: ["HyperText Transfer Protocol","HighText Transfer Process","HyperText Transmission Protocol","HyperText Transfer Process"], correctAnswer: 0 },
      { questionText: "Which sorting algorithm has best average time complexity?", options: ["Bubble Sort","Quick Sort","Selection Sort","Insertion Sort"], correctAnswer: 1 },
      { questionText: "What is a primary key in a database?", options: ["First column of every table","Uniquely identifies each record","A foreign key reference","An encrypted password field"], correctAnswer: 1 },
      { questionText: "Which OSI layer handles routing of packets?", options: ["Data Link Layer","Transport Layer","Network Layer","Session Layer"], correctAnswer: 2 },
      { questionText: "What is the full form of SQL?", options: ["Standard Query Language","Structured Query Language","Sequential Query Language","System Query Language"], correctAnswer: 1 },
      { questionText: "Which is NOT an OOP principle?", options: ["Encapsulation","Inheritance","Compilation","Polymorphism"], correctAnswer: 2 },
      { questionText: "What does RAM stand for?", options: ["Read Access Memory","Random Access Module","Random Access Memory","Read And Modify"], correctAnswer: 2 },
      { questionText: "Which protocol is used to send emails?", options: ["FTP","HTTP","SMTP","POP3"], correctAnswer: 2 }
    ]
  },
  {
    title: "World Capitals Quiz",
    description: "Do you know your world capitals? Test yourself with capitals of countries from every continent.",
    category: "Geography",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "What is the capital of Brazil?", options: ["Sao Paulo","Rio de Janeiro","Brasilia","Salvador"], correctAnswer: 2 },
      { questionText: "What is the capital of Canada?", options: ["Toronto","Vancouver","Montreal","Ottawa"], correctAnswer: 3 },
      { questionText: "What is the capital of South Africa?", options: ["Cape Town only","Johannesburg","Pretoria (executive capital)","Durban"], correctAnswer: 2 },
      { questionText: "What is the capital of China?", options: ["Shanghai","Hong Kong","Guangzhou","Beijing"], correctAnswer: 3 },
      { questionText: "What is the capital of Argentina?", options: ["Cordoba","Rosario","Buenos Aires","Mendoza"], correctAnswer: 2 },
      { questionText: "What is the capital of Egypt?", options: ["Alexandria","Luxor","Cairo","Giza"], correctAnswer: 2 },
      { questionText: "What is the capital of South Korea?", options: ["Busan","Incheon","Daegu","Seoul"], correctAnswer: 3 },
      { questionText: "What is the capital of New Zealand?", options: ["Auckland","Christchurch","Wellington","Hamilton"], correctAnswer: 2 },
      { questionText: "What is the capital of Saudi Arabia?", options: ["Jeddah","Mecca","Medina","Riyadh"], correctAnswer: 3 },
      { questionText: "What is the capital of Germany?", options: ["Munich","Frankfurt","Hamburg","Berlin"], correctAnswer: 3 }
    ]
  },
  {
    title: "Algebra and Equations",
    description: "Solve algebraic problems involving equations, inequalities, polynomials and quadratic formulas.",
    category: "Mathematics",
    difficulty: "Hard",
    isPublished: true,
    questions: [
      { questionText: "What is the solution of 2x + 5 = 15?", options: ["x=4","x=5","x=6","x=7"], correctAnswer: 1 },
      { questionText: "What is the discriminant of x²-4x+4=0?", options: ["0","4","8","16"], correctAnswer: 0 },
      { questionText: "What is the slope of the line y = 3x + 7?", options: ["7","3","10","0"], correctAnswer: 1 },
      { questionText: "If f(x) = x² + 3, what is f(4)?", options: ["14","16","19","22"], correctAnswer: 2 },
      { questionText: "What are the roots of x² - 5x + 6 = 0?", options: ["2 and 3","1 and 6","2 and 4","3 and 4"], correctAnswer: 0 },
      { questionText: "What is the value of log₁₀(1000)?", options: ["2","3","4","10"], correctAnswer: 1 },
      { questionText: "Simplify: (a+b)² - (a-b)²", options: ["2ab","4ab","a²+b²","2a²"], correctAnswer: 1 },
      { questionText: "What is the sum of roots of x² - 7x + 12 = 0?", options: ["3","4","7","12"], correctAnswer: 2 },
      { questionText: "Which is the correct factorization of x²-9?", options: ["(x+3)(x+3)","(x-3)(x-3)","(x+3)(x-3)","(x+9)(x-1)"], correctAnswer: 2 },
      { questionText: "If 3x = 27, what is the value of x?", options: ["2","3","4","9"], correctAnswer: 1 }
    ]
  },
  {
    title: "Cyber Security Basics",
    description: "Learn and test your knowledge of cyber security concepts, threats, encryption and best practices.",
    category: "Technology",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "What does VPN stand for?", options: ["Virtual Private Node","Virtual Public Network","Virtual Private Network","Verified Private Network"], correctAnswer: 2 },
      { questionText: "What type of attack tricks users into revealing sensitive information?", options: ["Malware","Phishing","DDoS","Ransomware"], correctAnswer: 1 },
      { questionText: "What does SSL stand for?", options: ["Secure Socket Layer","Standard Security Login","Server Side Logic","Secure System Link"], correctAnswer: 0 },
      { questionText: "What is two-factor authentication (2FA)?", options: ["Using two passwords","Logging in from two devices","Verifying identity with two different methods","Encrypting data twice"], correctAnswer: 2 },
      { questionText: "What is a firewall used for?", options: ["Cooling computer hardware","Monitoring and filtering network traffic","Encrypting hard drive data","Scanning files for viruses only"], correctAnswer: 1 },
      { questionText: "What does HTTPS use to secure connections?", options: ["HTTP","FTP","TLS/SSL","UDP"], correctAnswer: 2 },
      { questionText: "What is a DDoS attack?", options: ["Stealing personal data","Overloading a server with massive traffic","Injecting malicious SQL code","Installing a keylogger"], correctAnswer: 1 },
      { questionText: "Which is the strongest type of password?", options: ["yourname123","password2024","Tr0ub4dor&3#kL9","qwerty12345"], correctAnswer: 2 },
      { questionText: "What is encryption?", options: ["Deleting sensitive files","Converting data into unreadable format using a key","Compressing files for storage","Backing up data to cloud"], correctAnswer: 1 },
      { questionText: "What is a zero-day vulnerability?", options: ["A bug found on launch day","An exploit with no patch available yet","A server with zero uptime","A password with no expiry"], correctAnswer: 1 }
    ]
  },
  {
    title: "Animals Around the World",
    description: "Test your knowledge of wild animals, habitats, behaviors and fun animal facts.",
    category: "General Knowledge",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "Which is the fastest land animal?", options: ["Lion","Leopard","Cheetah","Jaguar"], correctAnswer: 2 },
      { questionText: "How many hearts does an octopus have?", options: ["1","2","3","4"], correctAnswer: 2 },
      { questionText: "Which animal has the longest neck?", options: ["Elephant","Camel","Giraffe","Ostrich"], correctAnswer: 2 },
      { questionText: "What is a group of lions called?", options: ["Pack","Herd","Pride","Flock"], correctAnswer: 2 },
      { questionText: "Which is the largest mammal in the world?", options: ["African Elephant","Blue Whale","Sperm Whale","Giraffe"], correctAnswer: 1 },
      { questionText: "Which bird cannot fly but can run very fast?", options: ["Penguin","Ostrich","Kiwi","Emu"], correctAnswer: 1 },
      { questionText: "What do pandas mainly eat?", options: ["Fish","Berries","Bamboo","Insects"], correctAnswer: 2 },
      { questionText: "Which animal is known as the Ship of the Desert?", options: ["Horse","Donkey","Camel","Llama"], correctAnswer: 2 },
      { questionText: "How long is an elephant's pregnancy?", options: ["9 months","12 months","18 months","22 months"], correctAnswer: 3 },
      { questionText: "Which is the only mammal that can fly?", options: ["Flying Squirrel","Bat","Flying Fox","Sugar Glider"], correctAnswer: 1 }
    ]
  },
  {
    title: "Netflix & Web Series Trivia",
    description: "Are you a true binge watcher? Test your knowledge of popular Netflix and web series.",
    category: "Entertainment",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "In which country is the Netflix series 'Money Heist' originally set?", options: ["Italy","France","Spain","Portugal"], correctAnswer: 2 },
      { questionText: "What is the name of the fictional town in Stranger Things?", options: ["Hawkins","Riverdale","Greendale","Springfield"], correctAnswer: 0 },
      { questionText: "Which Netflix series is based on the Witcher books?", options: ["Shadow and Bone","The Witcher","Kingdom","Arcane"], correctAnswer: 1 },
      { questionText: "How many seasons does Breaking Bad have?", options: ["4","5","6","7"], correctAnswer: 1 },
      { questionText: "What is the Korean series about a deadly children's game?", options: ["All of Us Are Dead","Kingdom","Squid Game","Hellbound"], correctAnswer: 2 },
      { questionText: "Who played Thomas Shelby in Peaky Blinders?", options: ["Cillian Murphy","Tom Hardy","Paul Anderson","Joe Cole"], correctAnswer: 0 },
      { questionText: "Which series features the characters 'Rick and Morty'?", options: ["The Simpsons","Family Guy","Rick and Morty","South Park"], correctAnswer: 2 },
      { questionText: "What is the name of the main character in The Mandalorian?", options: ["Boba Fett","Din Djarin","Grogu","Jango Fett"], correctAnswer: 1 },
      { questionText: "Which show is set in the fictional continent of Westeros?", options: ["Vikings","The Last Kingdom","Game of Thrones","Outlander"], correctAnswer: 2 },
      { questionText: "Who created the show 'Black Mirror'?", options: ["Charlie Brooker","Vince Gilligan","David Benioff","Jon Favreau"], correctAnswer: 0 }
    ]
  },
  {
    title: "Classic Literature",
    description: "Test your knowledge of classic novels, famous authors, and literary masterpieces.",
    category: "Language",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Who wrote 'Pride and Prejudice'?", options: ["Emily Brontë","Jane Austen","Charlotte Brontë","Mary Shelley"], correctAnswer: 1 },
      { questionText: "Which novel begins with 'Call me Ishmael'?", options: ["Moby-Dick","The Old Man and the Sea","Treasure Island","Robinson Crusoe"], correctAnswer: 0 },
      { questionText: "Who is the author of '1984'?", options: ["Aldous Huxley","George Orwell","Ray Bradbury","Arthur C. Clarke"], correctAnswer: 1 },
      { questionText: "In which city is 'Romeo and Juliet' set?", options: ["Venice","Rome","Florence","Verona"], correctAnswer: 3 },
      { questionText: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee","John Steinbeck","F. Scott Fitzgerald","Ernest Hemingway"], correctAnswer: 0 },
      { questionText: "What is the name of the monster's creator in Mary Shelley's novel?", options: ["Igor","Dracula","Victor Frankenstein","Henry Clerval"], correctAnswer: 2 },
      { questionText: "Who wrote the play 'Hamlet'?", options: ["Christopher Marlowe","William Shakespeare","Ben Jonson","John Webster"], correctAnswer: 1 },
      { questionText: "Which author wrote under the pen name 'Mark Twain'?", options: ["Samuel Langhorne Clemens","Charles Lutwidge Dodgson","Eric Arthur Blair","Mary Ann Evans"], correctAnswer: 0 },
      { questionText: "What is the first book in the Harry Potter series?", options: ["Chamber of Secrets","Prisoner of Azkaban","Philosopher's Stone","Goblet of Fire"], correctAnswer: 2 },
      { questionText: "Who wrote 'The Catcher in the Rye'?", options: ["J.D. Salinger","Jack Kerouac","F. Scott Fitzgerald","Ernest Hemingway"], correctAnswer: 0 }
    ]
  },
  {
    title: "Modern Pop Music",
    description: "Do you know today's top hits and artists? Test your knowledge of modern pop music.",
    category: "Entertainment",
    difficulty: "Easy",
    isPublished: true,
    questions: [
      { questionText: "Who sang the hit song 'Shape of You'?", options: ["Justin Bieber","Ed Sheeran","Shawn Mendes","Charlie Puth"], correctAnswer: 1 },
      { questionText: "Which artist's fans are known as 'Swifties'?", options: ["Selena Gomez","Ariana Grande","Taylor Swift","Katy Perry"], correctAnswer: 2 },
      { questionText: "Who is the 'Queen of Pop'?", options: ["Madonna","Britney Spears","Lady Gaga","Beyoncé"], correctAnswer: 0 },
      { questionText: "Which group sang 'Dynamite'?", options: ["EXO","BLACKPINK","BTS","Seventeen"], correctAnswer: 2 },
      { questionText: "Who won the Grammy for Album of the Year in 2020 for 'When We All Fall Asleep, Where Do We Go?'", options: ["Billie Eilish","Lizzo","Ariana Grande","Lana Del Rey"], correctAnswer: 0 },
      { questionText: "What is the real name of The Weeknd?", options: ["Abel Tesfaye","Aubrey Graham","Austin Post","Marshall Mathers"], correctAnswer: 0 },
      { questionText: "Which artist released the album 'Future Nostalgia'?", options: ["Miley Cyrus","Dua Lipa","Doja Cat","Olivia Rodrigo"], correctAnswer: 1 },
      { questionText: "Who sang the theme song 'Skyfall' for the James Bond film?", options: ["Adele","Sam Smith","Billie Eilish","Shirley Bassey"], correctAnswer: 0 },
      { questionText: "Which pop star starred in the movie 'A Star is Born' (2018)?", options: ["Rihanna","Lady Gaga","Katy Perry","Jennifer Lopez"], correctAnswer: 1 },
      { questionText: "What was Olivia Rodrigo's debut single?", options: ["good 4 u","deja vu","drivers license","traitor"], correctAnswer: 2 }
    ]
  },
  {
    title: "The Periodic Table",
    description: "Test your chemistry knowledge by identifying elements, their symbols, and properties.",
    category: "Science",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "What is the chemical symbol for Gold?", options: ["Ag","Au","Pb","Fe"], correctAnswer: 1 },
      { questionText: "Which element has the atomic number 1?", options: ["Helium","Oxygen","Hydrogen","Carbon"], correctAnswer: 2 },
      { questionText: "What is the symbol for Sodium?", options: ["S","So","Na","Nd"], correctAnswer: 2 },
      { questionText: "Which is the lightest noble gas?", options: ["Neon","Argon","Helium","Krypton"], correctAnswer: 2 },
      { questionText: "What is the chemical symbol for Iron?", options: ["Ir","In","Fe","I"], correctAnswer: 2 },
      { questionText: "Which element is liquid at room temperature?", options: ["Mercury","Lead","Copper","Zinc"], correctAnswer: 0 },
      { questionText: "What is the main component of diamonds?", options: ["Silicon","Carbon","Oxygen","Nitrogen"], correctAnswer: 1 },
      { questionText: "Which halogen is a greenish-yellow gas?", options: ["Fluorine","Chlorine","Bromine","Iodine"], correctAnswer: 1 },
      { questionText: "What is the symbol for Potassium?", options: ["P","Po","K","Pt"], correctAnswer: 2 },
      { questionText: "Which element makes up most of the Earth's atmosphere?", options: ["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"], correctAnswer: 2 }
    ]
  },
  {
    title: "Art & Artists",
    description: "Explore the world of fine art, famous paintings, and the masters who created them.",
    category: "Other",
    difficulty: "Medium",
    isPublished: true,
    questions: [
      { questionText: "Who painted 'The Starry Night'?", options: ["Claude Monet","Vincent van Gogh","Pablo Picasso","Salvador Dalí"], correctAnswer: 1 },
      { questionText: "Which artist is famous for the 'Mona Lisa'?", options: ["Michelangelo","Raphael","Leonardo da Vinci","Donatello"], correctAnswer: 2 },
      { questionText: "What art movement is Salvador Dalí associated with?", options: ["Impressionism","Cubism","Surrealism","Expressionism"], correctAnswer: 2 },
      { questionText: "Who painted the ceiling of the Sistine Chapel?", options: ["Leonardo da Vinci","Michelangelo","Botticelli","Titian"], correctAnswer: 1 },
      { questionText: "Which artist is known for his 'Campbell's Soup Cans'?", options: ["Jackson Pollock","Andy Warhol","Roy Lichtenstein","Mark Rothko"], correctAnswer: 1 },
      { questionText: "What style of art is Pablo Picasso most famous for co-founding?", options: ["Cubism","Surrealism","Abstract Expressionism","Fauvism"], correctAnswer: 0 },
      { questionText: "Who painted 'The Persistence of Memory' (melting clocks)?", options: ["René Magritte","Salvador Dalí","Max Ernst","Joan Miró"], correctAnswer: 1 },
      { questionText: "Which artist cut off his own ear?", options: ["Paul Gauguin","Henri Matisse","Vincent van Gogh","Edgar Degas"], correctAnswer: 2 },
      { questionText: "Who painted 'The Scream'?", options: ["Edvard Munch","Gustav Klimt","Egon Schiele","Marc Chagall"], correctAnswer: 0 },
      { questionText: "Where is the 'Mona Lisa' displayed?", options: ["The Met","The Louvre","The Uffizi","The British Museum"], correctAnswer: 1 }
    ]
  }
];

const seedDB = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');

    // Clear existing collections
    await User.deleteMany();
    await Quiz.deleteMany();
    await Attempt.deleteMany();
    console.log('Cleared existing User, Quiz, and Attempt collections.');

    // Hash passwords and create users using insertMany to bypass pre-save hooks safely 
    // and strictly adhere to bcryptjs saltRounds: 10
    const hashedUsers = await Promise.all(usersData.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Successfully created ${createdUsers.length} demo users.`);

    // Distribute quizzes evenly across users
    quizzesData.forEach((quiz, index) => {
      quiz.createdBy = createdUsers[index % 3]._id;
    });

    const createdQuizzes = await Quiz.insertMany(quizzesData);
    console.log(`Successfully created ${createdQuizzes.length} quizzes across all categories.`);

    console.log('-------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedDB();
