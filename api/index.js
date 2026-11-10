// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// src/data/verifiedCharacterSets.ts
var VERIFIED_CATEGORIES = [
  {
    id: "glasses-spectacles-goggles",
    keywords: ["glasses", "spectacles", "goggles"],
    trait: "Both characters wear prominent, oversized glasses, spectacles, or goggles.",
    name: "All characters wear glasses, spectacles, or goggles",
    characters: [
      { name: "Harry Potter", origin: "Harry Potter", wikiSlug: "Harry_Potter_(character)", hint: "The Boy Who Lived with round spectacles", traitVerification: "Wears iconic round wire-rimmed glasses throughout all stories" },
      { name: "Velma Dinkley", origin: "Scooby-Doo", wikiSlug: "Velma_Dinkley", hint: `Mystery Inc. genius: "My glasses! I can't see without my glasses!"`, traitVerification: "Famous for thick square black-rimmed glasses" },
      { name: "Clark Kent", origin: "DC Comics", wikiSlug: "Clark_Kent", hint: "Daily Planet reporter disguising Superman with glasses", traitVerification: "Wears horn-rimmed eyeglasses as his signature mild-mannered disguise" },
      { name: "Edna Mode", origin: "The Incredibles", wikiSlug: "Edna_Mode", hint: 'Legendary superhero suit designer: "No capes!"', traitVerification: "Wears oversized circular black spectacles" },
      { name: "Doc Brown", origin: "Back to the Future", wikiSlug: "Doc_Brown", hint: "Eccentric inventor of the time-traveling DeLorean", traitVerification: "Wears futuristic silver wraparound goggles and glasses" },
      { name: "Walter White", origin: "Breaking Bad", wikiSlug: "Walter_White_(Breaking_Bad)", hint: "Chemistry teacher turned methamphetamine kingpin", traitVerification: "Wears wire-rimmed prescription glasses" },
      { name: "Cyclops (Scott Summers)", origin: "Marvel / X-Men", wikiSlug: "Cyclops_(Marvel_Comics)", hint: "X-Men leader who must wear ruby-quartz eyewear", traitVerification: "Wears special ruby-quartz glasses and visor to restrain his optic blasts" },
      { name: "Arthur Read", origin: "Arthur / PBS", wikiSlug: "Arthur_Read", hint: "Beloved aardvark kid with yellow sweater", traitVerification: "Iconic round wire-rimmed glasses on his face" },
      { name: "Where's Waldo", origin: "Where's Waldo? / Martin Handford", wikiSlug: "Where's_Wally%3F", hint: "Globe-traveling wanderer in striped red shirt", traitVerification: "Always wears round black glasses and bobble hat" },
      { name: "Albus Dumbledore", origin: "Harry Potter", wikiSlug: "Albus_Dumbledore", hint: "Hogwarts Headmaster with half-moon spectacles", traitVerification: "Known for peering over half-moon spectacles" },
      { name: "Milhouse Van Houten", origin: "The Simpsons", wikiSlug: "Milhouse_Van_Houten", hint: "Bart Simpson's best friend with blue hair", traitVerification: "Wears thick red-framed glasses" },
      { name: "Simon Seville", origin: "Alvin and the Chipmunks", wikiSlug: "Alvin_and_the_Chipmunks", hint: "The tall, intellectual chipmunk in blue", traitVerification: "Wears round black eyeglasses" },
      { name: "Steve Urkel", origin: "Family Matters", wikiSlug: "Steve_Urkel", hint: 'Nerdy neighbor: "Did I do that?"', traitVerification: "Wears oversized tortoise-shell glasses with a strap" },
      { name: "Carl Wheezer", origin: "The Adventures of Jimmy Neutron", wikiSlug: "Jimmy_Neutron", hint: "Allergic, llama-obsessed sidekick", traitVerification: "Wears round wire spectacles" },
      { name: "Egon Spengler", origin: "Ghostbusters", wikiSlug: "Egon_Spengler", hint: "Chief science mind of the Ghostbusters", traitVerification: "Wears distinctive oversized round glasses" },
      { name: "Morpheus", origin: "The Matrix", wikiSlug: "Morpheus_(The_Matrix)", hint: "Nebuchadnezzar captain offering red or blue pills", traitVerification: "Wears iconic frameless clip-on dark sunglasses" },
      { name: "Austin Powers", origin: "Austin Powers", wikiSlug: "Austin_Powers", hint: "International Man of Mystery", traitVerification: "Wears thick black horn-rimmed 1960s glasses" },
      { name: "Professor Farnsworth", origin: "Futurama", wikiSlug: "Professor_Farnsworth", hint: 'Planet Express owner: "Good news, everyone!"', traitVerification: "Wears extremely thick circular spectacles" },
      { name: "Roz", origin: "Monsters, Inc.", wikiSlug: "Monsters,_Inc.", hint: 'Slug administrator: "Always watching, Wazowski"', traitVerification: "Wears sharp pointed cat-eye spectacles" },
      { name: "John Lennon", origin: "The Beatles / History", wikiSlug: "John_Lennon", hint: "Legendary songwriter and peace icon", traitVerification: "Famous worldwide for his iconic round wire granny glasses" },
      { name: "Tina Belcher", origin: "Bob's Burgers", wikiSlug: "Tina_Belcher", hint: "Eldest Belcher sibling who loves horses and zombies", traitVerification: "Wears thick black rectangular glasses" },
      { name: "Daria Morgendorffer", origin: "Daria / MTV", wikiSlug: "Daria_Morgendorffer", hint: "Cynical, deadpan teenage observer of Lawndale", traitVerification: "Wears round black spectacles" },
      { name: "Dexter", origin: "Dexter's Laboratory", wikiSlug: "Dexter%27s_Laboratory", hint: "Boy genius with secret subterranean facility", traitVerification: "Wears wide black rectangular glasses" },
      { name: "Dwight Schrute", origin: "The Office", wikiSlug: "Dwight_Schrute", hint: "Assistant to the Regional Manager at Dunder Mifflin", traitVerification: "Wears classic metal aviator eyeglasses" },
      { name: "Geordi La Forge", origin: "Star Trek: The Next Generation", wikiSlug: "Geordi_La_Forge", hint: "Chief Engineer of the USS Enterprise-D", traitVerification: "Wears a specialized VISOR and ocular implants to see" }
    ]
  },
  {
    id: "iconic-hats",
    keywords: ["hat", "fedora", "top hat", "cowboy hat", "wizard hat", "headwear"],
    trait: "Both characters wear an iconic hat (fedora, top hat, cowboy hat, or wizard hat) that rarely comes off.",
    name: "All characters wear an iconic hat",
    characters: [
      { name: "Indiana Jones", origin: "Indiana Jones", wikiSlug: "Indiana_Jones", hint: "Archaeology professor who braves ancient temples", traitVerification: "Wears his signature brown fedora hat in every adventure" },
      { name: "Gandalf", origin: "The Lord of the Rings", wikiSlug: "Gandalf", hint: "Grey and White wizard guiding Middle-earth", traitVerification: "Wears a pointed blue/grey wizard hat" },
      { name: "Sherlock Holmes", origin: "Arthur Conan Doyle", wikiSlug: "Sherlock_Holmes", hint: "Consulting detective of 221B Baker Street", traitVerification: "Famous for his double-billed deerstalker cap" },
      { name: "Willy Wonka", origin: "Roald Dahl", wikiSlug: "Willy_Wonka", hint: "Eccentric confectioner and factory owner", traitVerification: "Wears an eccentric brown top hat" },
      { name: "The Cat in the Hat", origin: "Dr. Seuss", wikiSlug: "The_Cat_in_the_Hat_(character)", hint: "Mischievous feline visiting on a rainy day", traitVerification: "Wears a tall red-and-white striped stovepipe top hat" },
      { name: "Freddy Krueger", origin: "A Nightmare on Elm Street", wikiSlug: "Freddy_Krueger", hint: "Dream stalker with a bladed glove", traitVerification: "Wears a dirty brown fedora in all dream sequences" },
      { name: "Mario", origin: "Nintendo", wikiSlug: "Mario", hint: "Heroic Italian plumber saving the Mushroom Kingdom", traitVerification: "Wears his famous red peaked cap with an M emblem" },
      { name: "Woody", origin: "Toy Story", wikiSlug: "Sheriff_Woody", hint: "Pull-string cowboy sheriff doll", traitVerification: "Wears an iconic brown stitched cowboy hat" },
      { name: "Monkey D. Luffy", origin: "One Piece", wikiSlug: "Monkey_D._Luffy", hint: "Rubber-powered captain of the Straw Hat Pirates", traitVerification: "Known worldwide by his trademark Straw Hat given by Shanks" },
      { name: "Walter White (Heisenberg)", origin: "Breaking Bad", wikiSlug: "Walter_White_(Breaking_Bad)", hint: "Chemistry teacher turned Albuquerque kingpin", traitVerification: "Wears his black pork pie hat as Heisenberg" },
      { name: "Carmen Sandiego", origin: "Where in the World Is Carmen Sandiego?", wikiSlug: "Carmen_Sandiego_(character)", hint: "World-traveling master thief in red", traitVerification: "Wears an iconic wide-brimmed red fedora" },
      { name: "Abraham Lincoln", origin: "American History", wikiSlug: "Abraham_Lincoln", hint: "16th U.S. President who issued the Emancipation Proclamation", traitVerification: "Historically known for his tall black stovepipe top hat" },
      { name: "Paddington Bear", origin: "Michael Bond", wikiSlug: "Paddington_Bear", hint: "Polite bear from Darkest Peru loving marmalade", traitVerification: "Always wears an iconic battered red bush hat" },
      { name: "Zorro", origin: "Johnston McCulley", wikiSlug: "Zorro", hint: 'Masked California vigilante carving a "Z"', traitVerification: "Wears a black Spanish flat-brimmed cordobes hat" },
      { name: "Captain Jack Sparrow", origin: "Pirates of the Caribbean", wikiSlug: "Jack_Sparrow", hint: "Eccentric pirate captain of the Black Pearl", traitVerification: "Obsessed with his leather pirate tricorn hat" },
      { name: "Mad Hatter", origin: "Alice in Wonderland", wikiSlug: "Hatter_(Alice%27s_Adventures_in_Wonderland)", hint: "Tea-drinking host with price tag 10/6", traitVerification: "Wears an oversized top hat with a 10/6 ticket" },
      { name: "Robin Hood", origin: "English Folklore", wikiSlug: "Robin_Hood", hint: "Outlaw who steals from the rich to give to the poor", traitVerification: "Wears a green bycocket cap with a feather" },
      { name: "Ash Ketchum", origin: "Pokemon", wikiSlug: "Ash_Ketchum", hint: "Trainer striving to be the very best", traitVerification: "Always turns his red-and-white Pokemon League cap backwards" },
      { name: "Inspector Gadget", origin: "Inspector Gadget", wikiSlug: "Inspector_Gadget_(character)", hint: "Cyborg detective with gadgets inside his clothes", traitVerification: "Wears a grey fedora that sprouts helicopter blades" },
      { name: "Slash", origin: "Guns N' Roses", wikiSlug: "Slash_(musician)", hint: "Rock guitar hero known for Sweet Child O' Mine", traitVerification: "Iconic tall black top hat with silver conchos" }
    ]
  },
  {
    id: "bald-hairless",
    keywords: ["bald", "hairless", "lack any head hair"],
    trait: "Both characters are completely bald or lack any head hair by design.",
    name: "All characters are completely bald or lack head hair",
    characters: [
      { name: "Walter White", origin: "Breaking Bad", wikiSlug: "Walter_White_(Breaking_Bad)", hint: "Albuquerque teacher turned kingpin Heisenberg", traitVerification: "Shaves his head completely smooth throughout the series" },
      { name: "Professor X (Charles Xavier)", origin: "Marvel / X-Men", wikiSlug: "Professor_X", hint: "Telepathic founder of the X-Men school", traitVerification: "Canonically completely bald due to his mutant telepathic powers" },
      { name: "Saitama", origin: "One Punch Man", wikiSlug: "One-Punch_Man", hint: "Hero for fun who defeats foes in a single strike", traitVerification: "Lost all his hair from intense physical training" },
      { name: "Lord Voldemort", origin: "Harry Potter", wikiSlug: "Lord_Voldemort", hint: "Dark Lord who created seven Horcruxes", traitVerification: "Reborn with a completely bald, snakelike skull" },
      { name: "Homer Simpson", origin: "The Simpsons", wikiSlug: "Homer_Simpson", hint: "Springfield nuclear safety inspector loving donuts", traitVerification: "Almost completely bald with only two curved hairs" },
      { name: "Gru", origin: "Despicable Me", wikiSlug: "Gru", hint: "Former supervillain father of three girls and Minions", traitVerification: "Character design is completely bald with a sharp nose" },
      { name: "Aang", origin: "Avatar: The Last Airbender", wikiSlug: "Aang", hint: "Air Nomad Avatar who mastered all four elements", traitVerification: "Shaves head bald as an Air Nomad monk with blue arrow tattoo" },
      { name: "Lex Luthor", origin: "DC Comics", wikiSlug: "Lex_Luthor", hint: "Billionaire industrialist archenemy of Superman", traitVerification: "Iconic gleaming bald head in comic book canon" },
      { name: "Captain Jean-Luc Picard", origin: "Star Trek: The Next Generation", wikiSlug: "Jean-Luc_Picard", hint: "Distinguished Starfleet captain of the Enterprise", traitVerification: "Famously bald captain portrayed by Patrick Stewart" },
      { name: "Krillin", origin: "Dragon Ball", wikiSlug: "Krillin", hint: "Goku's loyal lifelong martial arts best friend", traitVerification: "Shaves his head completely bald as an Orin Temple monk" },
      { name: "Dominic Toretto", origin: "Fast & Furious", wikiSlug: "Dominic_Toretto", hint: 'Street racer championing "family" above all', traitVerification: "Played bald by Vin Diesel throughout all movies" },
      { name: "Thanos", origin: "Marvel", wikiSlug: "Thanos", hint: "Mad Titan who gathered the six Infinity Stones", traitVerification: "Titan warlord with a completely hairless purple skull" },
      { name: "Drax the Destroyer", origin: "Marvel / Guardians of the Galaxy", wikiSlug: "Drax_the_Destroyer", hint: "Literal-minded warrior covered in red tattoos", traitVerification: "Completely hairless alien warrior" },
      { name: "Kratos", origin: "God of War", wikiSlug: "Kratos_(God_of_War)", hint: "Spartan warrior who brought down the Greek pantheon", traitVerification: "Completely bald head bearing a red ash tattoo" },
      { name: "Morpheus", origin: "The Matrix", wikiSlug: "Morpheus_(The_Matrix)", hint: "Captain of the Nebuchadnezzar in the real world", traitVerification: "Shaven bald head portrayed by Laurence Fishburne" },
      { name: "Mr. Clean", origin: "Procter & Gamble / Mascot", wikiSlug: "Mr._Clean", hint: "White-shirted cleaning mascot with golden earring", traitVerification: "Legendary shiny bald mascot" },
      { name: "Popeye the Sailor", origin: "E. C. Segar", wikiSlug: "Popeye", hint: 'Spinach-chomping mariner: "I yam what I yam"', traitVerification: "Cartoon sailor with a bald head beneath his white sailor cap" },
      { name: "Charlie Brown", origin: "Peanuts / Charles M. Schulz", wikiSlug: "Charlie_Brown", hint: "Lovable loser who never manages to kick the football", traitVerification: "Character design is almost completely bald with one curl of hair" },
      { name: "Dr. Evil", origin: "Austin Powers", wikiSlug: "Dr._Evil", hint: "Cryogenically frozen mastermind demanding one million dollars", traitVerification: "Completely hairless parody of Blofeld" },
      { name: "Ernst Stavro Blofeld", origin: "James Bond / 007", wikiSlug: "Ernst_Stavro_Blofeld", hint: "SPECTRE mastermind stroking a white Persian cat", traitVerification: "Classic Bond villain depicted with a bald head and facial scar" }
    ]
  },
  {
    id: "masks-helmets-disguises",
    keywords: ["mask", "helmet", "disguise", "conceal their true face"],
    trait: "Both characters conceal their true face behind a mask, helmet, or heavy disguise.",
    name: "All characters conceal their face behind a mask or helmet",
    characters: [
      { name: "Batman (Bruce Wayne)", origin: "DC Comics", wikiSlug: "Batman", hint: "Dark Knight protecting Gotham City in a black cowl", traitVerification: "Conceals his face behind his signature bat-eared cowl" },
      { name: "Spider-Man (Peter Parker)", origin: "Marvel", wikiSlug: "Spider-Man", hint: "Friendly neighborhood wall-crawler in red and blue", traitVerification: "Wears a full fabric face mask with one-way mirrored lenses" },
      { name: "Darth Vader", origin: "Star Wars", wikiSlug: "Darth_Vader", hint: "Sith Lord breathing through a menacing black apparatus", traitVerification: "Enclosed permanently in a sealed black respirator helmet" },
      { name: "Deadpool (Wade Wilson)", origin: "Marvel", wikiSlug: "Deadpool", hint: "Merc with a mouth who breaks the fourth wall", traitVerification: "Covers his scarred face completely with a red and black fabric mask" },
      { name: "Master Chief", origin: "Halo", wikiSlug: "Master_Chief_(Halo)", hint: "Spartan super-soldier fighting the Covenant", traitVerification: "Never removes his golden-visored MJOLNIR assault helmet" },
      { name: "Din Djarin (The Mandalorian)", origin: "Star Wars", wikiSlug: "The_Mandalorian_(character)", hint: "Bounty hunter bound by the Creed never to show his face", traitVerification: "Sworn by Mandalorian creed never to remove his beskar helmet" },
      { name: "Boba Fett", origin: "Star Wars", wikiSlug: "Boba_Fett", hint: "Mandalorian bounty hunter tracking Han Solo", traitVerification: "Wears a battered Mandalorian helmet with a T-visor" },
      { name: "Ghostface", origin: "Scream", wikiSlug: "Ghostface_(Scream)", hint: `Horror slasher asking: "What's your favorite scary movie?"`, traitVerification: "Wears the iconic white melting-scream rubber mask" },
      { name: "Zorro", origin: "Johnston McCulley", wikiSlug: "Zorro", hint: "Masked outlaw defending Spanish California", traitVerification: "Wears a black domino mask covering his eyes and nose" },
      { name: "Rorschach", origin: "Watchmen", wikiSlug: "Rorschach_(character)", hint: "Uncompromising vigilante with a shifting inkblot face", traitVerification: "Considers his shifting black-and-white inkblot cloth to be his real face" },
      { name: "V (V for Vendetta)", origin: "Alan Moore / DC", wikiSlug: "V_(character)", hint: "Anarchist revolutionary quoting Shakespeare", traitVerification: "Always wears a smiling Guy Fawkes porcelain mask" },
      { name: "The Phantom of the Opera", origin: "Gaston Leroux", wikiSlug: "The_Phantom_of_the_Opera_(character)", hint: "Musical genius haunting the Paris Opera catacombs", traitVerification: "Wears a white half-mask to hide his disfigured face" },
      { name: "Jason Voorhees", origin: "Friday the 13th", wikiSlug: "Jason_Voorhees", hint: "Undead Crystal Lake slasher wielding a machete", traitVerification: "Famous for his white hockey goalie mask" },
      { name: "Iron Man (Tony Stark)", origin: "Marvel", wikiSlug: "Iron_Man", hint: "Armored Avenger and genius billionaire philanthropist", traitVerification: "Conceals his identity inside a gold-titanium combat helmet" },
      { name: "Kylo Ren", origin: "Star Wars", wikiSlug: "Kylo_Ren", hint: "Supreme Leader of the First Order wielding a crossguard saber", traitVerification: "Wears a black-and-silver face-concealing battle helmet" },
      { name: "Bane", origin: "DC Comics", wikiSlug: "Bane_(DC_Comics)", hint: "Venom-powered brute who broke Batman's back", traitVerification: "Wears a combat mask delivering analgesic gas" },
      { name: "Shredder", origin: "Teenage Mutant Ninja Turtles", wikiSlug: "Shredder_(Teenage_Mutant_Ninja_Turtles)", hint: "Foot Clan leader covered in bladed armor", traitVerification: "Wears a spiked metal face-covering kabuto helmet" },
      { name: "Rey Mysterio", origin: "WWE / Pro Wrestling", wikiSlug: "Rey_Mysterio", hint: "High-flying lucha libre champion of the 619", traitVerification: "Follows traditional Mexican lucha libre mask-wearing tradition" }
    ]
  },
  {
    id: "cybernetic-robotic-limbs",
    keywords: ["limb", "cybernetic", "robotic", "prosthetic", "bionic"],
    trait: "Both characters have artificial, robotic, or cybernetic limbs.",
    name: "All characters have artificial, robotic, or cybernetic limbs",
    characters: [
      { name: "Darth Vader", origin: "Star Wars", wikiSlug: "Darth_Vader", hint: "Sith Lord who lost his limbs on Mustafar", traitVerification: "All four limbs are cybernetic mechanical prosthetics" },
      { name: "Luke Skywalker", origin: "Star Wars", wikiSlug: "Luke_Skywalker", hint: "Jedi Knight who lost a hand on Cloud City", traitVerification: "Right hand was severed by Vader and replaced with a cybernetic prosthetic" },
      { name: "Winter Soldier (Bucky Barnes)", origin: "Marvel", wikiSlug: "Bucky_Barnes", hint: "Super soldier brainwashed with a silver arm", traitVerification: "Left arm was destroyed and replaced with a vibranium cybernetic bionic arm" },
      { name: "Cyborg (Victor Stone)", origin: "DC Comics", wikiSlug: "Cyborg_(DC_Comics)", hint: "Justice League titan fused with Apokoliptian technology", traitVerification: "Over seventy percent of his body consists of advanced robotic prosthetics" },
      { name: "General Grievous", origin: "Star Wars", wikiSlug: "General_Grievous", hint: "Kaleesh cyborg commander wielding four lightsabers", traitVerification: "His arms split into four separate mechanical limbs" },
      { name: "Raiden", origin: "Metal Gear Solid", wikiSlug: "Raiden_(Metal_Gear)", hint: "White-haired operative turned high-frequency cyborg ninja", traitVerification: "Full-body prosthetic cyborg exoskeleton" },
      { name: "Edward Elric", origin: "Fullmetal Alchemist", wikiSlug: "Edward_Elric", hint: "State Alchemist searching for the Philosopher's Stone", traitVerification: "Wields steel automail prosthetic right arm and left leg" },
      { name: "Captain Hook", origin: "Peter Pan / J.M. Barrie", wikiSlug: "Captain_Hook", hint: "Pirate captain terrorized by the ticking crocodile", traitVerification: "Has an iron hook replacing the hand fed to the crocodile" },
      { name: "Cable (Nathan Summers)", origin: "Marvel", wikiSlug: "Cable_(character)", hint: "Time-traveling mutant son of Cyclops", traitVerification: "Left arm is composed of techno-organic cybernetic tissue" },
      { name: "Finn the Human", origin: "Adventure Time", wikiSlug: "Finn_the_Human", hint: "Hero of Ooo carrying magical swords", traitVerification: "Loses his right arm and gains a mechanical prosthetic arm" },
      { name: "Imperator Furiosa", origin: "Mad Max: Fury Road", wikiSlug: "Furiosa", hint: "War Rig commander escaping the Immortan Joe", traitVerification: "Wears a pneumatic hydraulic prosthetic mechanical left arm" },
      { name: "Barret Wallace", origin: "Final Fantasy VII", wikiSlug: "Barret_Wallace", hint: "Leader of Avalanche with an arm-mounted Gatling gun", traitVerification: "Right arm was amputated and replaced with a firearm prosthetic" },
      { name: "Jax Briggs", origin: "Mortal Kombat", wikiSlug: "Jax_(Mortal_Kombat)", hint: "Special Forces operative with ground-shattering punches", traitVerification: "Both biological arms were replaced with bionic cybernetic metal arms" },
      { name: "Inspector Gadget", origin: "Inspector Gadget", wikiSlug: "Inspector_Gadget_(character)", hint: "Bumbling detective with telescoping limbs", traitVerification: "Limbs and torso are packed with extendable mechanical cybernetics" }
    ]
  },
  {
    id: "sleuths-and-detectives",
    keywords: ["detective", "sleuth", "investigator", "solving mysteries"],
    trait: "Both characters work as cynical private investigators, detectives, or bounty hunters.",
    name: "All characters are detectives or crime investigators",
    characters: [
      { name: "Sherlock Holmes", origin: "Arthur Conan Doyle", wikiSlug: "Sherlock_Holmes", hint: "World's first consulting detective of 221B Baker Street", traitVerification: "The archetype of the forensic consulting detective" },
      { name: "Dr. John Watson", origin: "Arthur Conan Doyle", wikiSlug: "Dr._Watson", hint: "Former military doctor and chronicler of cases", traitVerification: "Co-investigator on all of Holmes's detective cases" },
      { name: "Hercule Poirot", origin: "Agatha Christie", wikiSlug: "Hercule_Poirot", hint: "Belgian detective relying on his little grey cells", traitVerification: "Celebrated Belgian private investigator" },
      { name: "Columbo", origin: "Columbo", wikiSlug: "Columbo_(character)", hint: 'LAPD homicide detective: "Just one more thing..."', traitVerification: "Lieutenant homicide detective in the Los Angeles Police Department" },
      { name: "Nancy Drew", origin: "Carolyn Keene", wikiSlug: "Nancy_Drew", hint: "Teenage amateur sleuth of River Heights", traitVerification: "Famous amateur teenage detective" },
      { name: "Benoit Blanc", origin: "Knives Out / Glass Onion", wikiSlug: "Benoit_Blanc", hint: "World-renowned Southern detective with a drawl", traitVerification: "Private consulting detective solving bizarre murders" },
      { name: "Velma Dinkley", origin: "Scooby-Doo", wikiSlug: "Velma_Dinkley", hint: "Brains of Mystery Inc. decoding monster hoaxes", traitVerification: "Core mystery investigator unmasking criminal schemes" },
      { name: "Batman (Bruce Wayne)", origin: "DC Comics", wikiSlug: "Batman", hint: "Known as the World's Greatest Detective in Gotham", traitVerification: "Formally titled the World's Greatest Detective" },
      { name: "Inspector Clouseau", origin: "The Pink Panther", wikiSlug: "Inspector_Clouseau", hint: "Accident-prone French police detective", traitVerification: "Chief inspector of the Surete solving jewelry crimes" },
      { name: "Miss Marple", origin: "Agatha Christie", wikiSlug: "Miss_Marple", hint: "Elderly spinster amateur sleuth of St. Mary Mead", traitVerification: "Amateur detective solving village murders" },
      { name: "Veronica Mars", origin: "Veronica Mars", wikiSlug: "Veronica_Mars_(character)", hint: "Neptune student private investigator", traitVerification: "Licensed California private investigator" },
      { name: "Ace Ventura", origin: "Ace Ventura", wikiSlug: "Ace_Ventura", hint: "Eccentric private investigator finding lost pets", traitVerification: "Private detective specializing in animal abductions" },
      { name: "Adrian Monk", origin: "Monk", wikiSlug: "Adrian_Monk", hint: "San Francisco homicide consultant with OCD", traitVerification: "Former SFPD detective turned private homicide consultant" },
      { name: "Scooby-Doo", origin: "Scooby-Doo", wikiSlug: "Scooby-Doo_(character)", hint: "Great Dane detective riding in the Mystery Machine", traitVerification: "Animal sleuth of Mystery Incorporated" }
    ]
  },
  {
    id: "magic-wizards-witches",
    keywords: ["magic", "wizard", "sorcerer", "witch", "spell"],
    trait: "Both characters possess extraordinary magical abilities or belong to an arcane order.",
    name: "All characters are wizards, witches, or magic wielders",
    characters: [
      { name: "Harry Potter", origin: "Harry Potter", wikiSlug: "Harry_Potter_(character)", hint: "Gryffindor wizard who defeated Lord Voldemort", traitVerification: "Trained wizard at Hogwarts School of Witchcraft and Wizardry" },
      { name: "Gandalf", origin: "The Lord of the Rings", wikiSlug: "Gandalf", hint: "Istari wizard who stood against the Balrog", traitVerification: "One of the five immortal Istari wizards sent to Middle-earth" },
      { name: "Hermione Granger", origin: "Harry Potter", wikiSlug: "Hermione_Granger", hint: "Brightest witch of her age at Hogwarts", traitVerification: "Master witch capable of advanced charms and transfiguration" },
      { name: "Doctor Strange", origin: "Marvel", wikiSlug: "Doctor_Strange", hint: "Master of the Mystic Arts and Sorcerer Supreme", traitVerification: "Former neurosurgeon who became Earth's Sorcerer Supreme" },
      { name: "Albus Dumbledore", origin: "Harry Potter", wikiSlug: "Albus_Dumbledore", hint: "Wielder of the Elder Wand and Hogwarts Headmaster", traitVerification: "Supreme Mugwump and greatest wizard of his era" },
      { name: "Scarlet Witch (Wanda Maximoff)", origin: "Marvel", wikiSlug: "Scarlet_Witch", hint: "Reality-warping sorceress wielding Chaos Magic", traitVerification: "Mythological being channeling innate chaos magic" },
      { name: "Lord Voldemort", origin: "Harry Potter", wikiSlug: "Lord_Voldemort", hint: "Dark wizard who commanded the Death Eaters", traitVerification: "Powerful dark wizard who split his soul into Horcruxes" },
      { name: "Severus Snape", origin: "Harry Potter", wikiSlug: "Severus_Snape", hint: "Potions Master and Half-Blood Prince", traitVerification: "Accomplished wizard, Occlumens, and Potions master" },
      { name: "Maleficent", origin: "Sleeping Beauty", wikiSlug: "Maleficent", hint: "Dark fairy who cursed Aurora to prick her finger", traitVerification: "Powerful sorceress summoning thorns and dragon transformations" },
      { name: "Merlin", origin: "Arthurian Legend", wikiSlug: "Merlin", hint: "Mythic wizard and adviser to King Arthur", traitVerification: "The legendary wizard and prophet of Camelot" },
      { name: "Zatanna", origin: "DC Comics", wikiSlug: "Zatanna", hint: "Stage magician who casts spells by speaking backward", traitVerification: "Homo magi sorceress channeling verbal backward spells" },
      { name: "John Constantine", origin: "DC / Vertigo", wikiSlug: "John_Constantine", hint: "Cynical British occult detective and warlock", traitVerification: "Practitioner of black magic, exorcisms, and demonology" }
    ]
  },
  {
    id: "fathers",
    keywords: ["father", "fathers", "paternal"],
    trait: "Both characters are fathers.",
    name: "All characters are fathers",
    characters: [
      { name: "Darth Vader", origin: "Star Wars", wikiSlug: "Darth_Vader", hint: 'Galactic enforcer: "No, I am your father"', traitVerification: "Biological father of Luke Skywalker and Princess Leia Organa" },
      { name: "Mufasa", origin: "The Lion King", wikiSlug: "Mufasa", hint: "Wise lion king of Pride Rock", traitVerification: "Devoted father of Simba" },
      { name: "Homer Simpson", origin: "The Simpsons", wikiSlug: "Homer_Simpson", hint: "Springfield nuclear safety inspector", traitVerification: "Father to Bart, Lisa, and Maggie Simpson" },
      { name: "Bob Parr (Mr. Incredible)", origin: "The Incredibles", wikiSlug: "Mr._Incredible", hint: "Super-strength hero heading a family of supers", traitVerification: "Father to Violet, Dash, and Jack-Jack Parr" },
      { name: "Ned Stark", origin: "Game of Thrones", wikiSlug: "Ned_Stark", hint: 'Lord of Winterfell: "Winter is Coming"', traitVerification: "Father to Robb, Sansa, Arya, Bran, and Rickon Stark" },
      { name: "Peter Griffin", origin: "Family Guy", wikiSlug: "Peter_Griffin", hint: "Quahog patriarch married to Lois", traitVerification: "Father to Meg, Chris, and Stewie Griffin" },
      { name: "Jim Hopper", origin: "Stranger Things", wikiSlug: "Jim_Hopper_(Stranger_Things)", hint: "Hawkins police chief who adopted Eleven", traitVerification: "Father to late daughter Sara and adoptive father to Eleven" },
      { name: "Marlin", origin: "Finding Nemo", wikiSlug: "Finding_Nemo", hint: "Clownfish who crossed the ocean to rescue his son", traitVerification: "Father who journeys to Sydney harbor to save his son Nemo" },
      { name: "Geppetto", origin: "Pinocchio", wikiSlug: "Mister_Geppetto", hint: "Italian woodcarver who wished on a star", traitVerification: "Loving father and creator of the puppet Pinocchio" },
      { name: "Joel Miller", origin: "The Last of Us", wikiSlug: "Joel_(The_Last_of_Us)", hint: "Survivor who carried Ellie across a fungal wasteland", traitVerification: "Father to late daughter Sarah and surrogate father to Ellie" },
      { name: "Arthur Weasley", origin: "Harry Potter", wikiSlug: "Arthur_Weasley", hint: "Muggle-obsessed Ministry of Magic official", traitVerification: "Father to Bill, Charlie, Percy, Fred, George, Ron, and Ginny" },
      { name: "Goofy", origin: "Disney", wikiSlug: "Goofy", hint: "Lovable anthropomorphic dog starring in A Goofy Movie", traitVerification: "Devoted single father to his son Max Goof" }
    ]
  },
  {
    id: "time-travelers",
    keywords: ["time", "travel through time", "manipulate time", "time-loop"],
    trait: "Both characters possess the ability to travel through time or manipulate the flow of time.",
    name: "All characters can travel through time or manipulate time",
    characters: [
      { name: "Doc Brown", origin: "Back to the Future", wikiSlug: "Doc_Brown", hint: "Scientist who built a time machine into a DeLorean", traitVerification: "Invented temporal displacement via the flux capacitor" },
      { name: "Marty McFly", origin: "Back to the Future", wikiSlug: "Marty_McFly", hint: "High school rock guitarist who traveled to 1955", traitVerification: "Travels repeatedly through 1955, 2015, and 1885" },
      { name: "The Doctor", origin: "Doctor Who", wikiSlug: "The_Doctor_(Doctor_Who)", hint: "Gallifreyan Time Lord piloting the blue TARDIS box", traitVerification: "Time Lord with natural ability to traverse the fourth dimension" },
      { name: "The Terminator (T-800)", origin: "The Terminator", wikiSlug: "The_Terminator_(character)", hint: "Cybernetic assassin sent back from 2029 to 1984", traitVerification: "Sent through a temporal displacement sphere from the future" },
      { name: "Hermione Granger", origin: "Harry Potter", wikiSlug: "Hermione_Granger", hint: "Used a golden hourglass pendant to take double classes", traitVerification: "Wielded the Time-Turner to travel back multiple hours" },
      { name: "Trunks", origin: "Dragon Ball", wikiSlug: "Trunks_(Dragon_Ball)", hint: "Sword-wielding Saiyan from an apocalyptic future", traitVerification: "Piloted Bulma's time machine to warn the Z-fighters" },
      { name: "Cable", origin: "Marvel", wikiSlug: "Cable_(character)", hint: "Mutant soldier traveling back to prevent world collapse", traitVerification: "Born in modern era, sent to future, travels back in time" },
      { name: "The Flash (Barry Allen)", origin: "DC Comics", wikiSlug: "Flash_(Barry_Allen)", hint: "Speedster who runs faster than the speed of light", traitVerification: "Can run so fast he breaks the time barrier into past or future" },
      { name: "Hiro Nakamura", origin: "Heroes", wikiSlug: "Hiro_Nakamura", hint: "Tokyo office worker who can bend space-time", traitVerification: "Possesses chronokinesis allowing him to pause and leap through time" },
      { name: "Bill S. Preston", origin: "Bill & Ted's Excellent Adventure", wikiSlug: "Bill_%26_Ted", hint: "Wyld Stallyns rocker traveling in a phone booth", traitVerification: "Travels across world history in Rufus's time-traveling telephone booth" }
    ]
  },
  {
    id: "food-culinary",
    keywords: ["chef", "cook", "baker", "culinary", "food or drink"],
    trait: "Both characters are professional chefs, bakers, or culinary perfectionists.",
    name: "All characters are chefs, cooks, or food obsessed",
    characters: [
      { name: "Gordon Ramsay", origin: "Celebrity Chef / TV", wikiSlug: "Gordon_Ramsay", hint: "Fiery Michelin-starred restaurateur and Hell's Kitchen host", traitVerification: "World-renowned professional multi-Michelin-starred chef" },
      { name: "Julia Child", origin: "Culinary Icon", wikiSlug: "Julia_Child", hint: "Pioneering chef who popularized French cuisine on television", traitVerification: "Iconic professional television chef and cookbook author" },
      { name: "Remy (Ratatouille)", origin: "Ratatouille / Pixar", wikiSlug: "Remy_(Ratatouille)", hint: "Passionate rat who cooks secretly at Gusteau's restaurant", traitVerification: "Culinary genius who prepares world-class Parisian haute cuisine" },
      { name: "SpongeBob SquarePants", origin: "Nickelodeon", wikiSlug: "SpongeBob_SquarePants_(character)", hint: "Enthusiastic fry cook at the Krusty Krab", traitVerification: "Head fry cook making signature Krabby Patties" },
      { name: "Sanji", origin: "One Piece", wikiSlug: "Sanji_(One_Piece)", hint: "Black Leg martial artist and Straw Hat chef", traitVerification: "Professional head cook of the Straw Hat pirate crew" },
      { name: "Monica Geller", origin: "Friends", wikiSlug: "Monica_Geller", hint: "Perfectionist head chef living in Manhattan", traitVerification: "Professional executive restaurant head chef" },
      { name: "Homer Simpson", origin: "The Simpsons", wikiSlug: "Homer_Simpson", hint: "Obsessed with pink frosted donuts and pork chops", traitVerification: "Famous for extreme, unending obsession with food and beer" },
      { name: "Garfield", origin: "Jim Davis", wikiSlug: "Garfield_(character)", hint: "Cynical orange tabby cat who hates Mondays and loves lasagna", traitVerification: "Obsessed exclusively with eating lasagna, pizza, and sleeping" },
      { name: "Cookie Monster", origin: "Sesame Street", wikiSlug: "Cookie_Monster", hint: "Blue Muppet who devours baked chocolate chip sweets", traitVerification: "Obsessed with eating cookies continuously" },
      { name: "Guy Fieri", origin: "Food Network", wikiSlug: "Guy_Fieri", hint: "Host of Diners, Drive-Ins and Dives", traitVerification: "Restaurateur and television culinary personality" }
    ]
  },
  {
    id: "green-design",
    keywords: ["green", "predominantly green"],
    trait: "Both characters are predominantly green in character design or wardrobe.",
    name: "All characters are predominantly green",
    characters: [
      { name: "Hulk (Bruce Banner)", origin: "Marvel", wikiSlug: "Hulk", hint: "Colossal emerald powerhouse fueled by rage", traitVerification: "Transforms into a massive green-skinned giant" },
      { name: "Yoda", origin: "Star Wars", wikiSlug: "Yoda", hint: "Wise, ancient Jedi Grand Master from Dagobah", traitVerification: "Alien species with wrinkly green skin and ears" },
      { name: "Shrek", origin: "DreamWorks", wikiSlug: "Shrek_(character)", hint: "Lovable ogre living in a muddy swamp", traitVerification: "Large green-skinned ogre" },
      { name: "Kermit the Frog", origin: "The Muppets", wikiSlug: "Kermit_the_Frog", hint: `Muppet leader: "It's not easy bein' green"`, traitVerification: "Green felt frog Muppet" },
      { name: "The Grinch", origin: "Dr. Seuss", wikiSlug: "The_Grinch", hint: "Mean green hermit who stole Christmas from Whoville", traitVerification: "Furry green-skinned creature who lives on Mt. Crumpit" },
      { name: "Luigi", origin: "Nintendo / Super Mario", wikiSlug: "Luigi", hint: "Mario's taller brother who wears a green cap and shirt", traitVerification: "Always wears green cap and green shirt in Nintendo canon" },
      { name: "Piccolo", origin: "Dragon Ball", wikiSlug: "Piccolo_(Dragon_Ball)", hint: "Namekian warrior and mentor to Gohan", traitVerification: "Namekian alien with bright green skin" },
      { name: "Mike Wazowski", origin: "Monsters, Inc.", wikiSlug: "Mike_Wazowski", hint: "One-eyed lime-green comedian monster", traitVerification: "Round green monster with a single eye" },
      { name: "Gamora", origin: "Marvel", wikiSlug: "Gamora", hint: "Deadliest woman in the galaxy and daughter of Thanos", traitVerification: "Zehoberei alien with green skin" },
      { name: "Peter Pan", origin: "J.M. Barrie / Disney", wikiSlug: "Peter_Pan_(Disney_character)", hint: "Boy who never grew up in Neverland", traitVerification: "Wears an iconic green tunic, tights, and cap" },
      { name: "Poison Ivy", origin: "DC Comics", wikiSlug: "Poison_Ivy_(character)", hint: "Botanical eco-terrorist who controls plant life", traitVerification: "Green leafy outfit and often green-tinted skin" }
    ]
  },
  {
    id: "blue-design",
    keywords: ["blue", "predominantly blue"],
    trait: "Both characters are predominantly blue in character design or wardrobe.",
    name: "All characters are predominantly blue",
    characters: [
      { name: "Sonic the Hedgehog", origin: "Sega", wikiSlug: "Sonic_the_Hedgehog_(character)", hint: "Blue Blur who runs at supersonic speed", traitVerification: "Anthropomorphic hedgehog with bright blue fur and quills" },
      { name: "Mega Man", origin: "Capcom", wikiSlug: "Mega_Man_(character)", hint: "Blue Bomber android wielding an arm cannon", traitVerification: "Wears blue robotic cybernetic armor" },
      { name: "Genie", origin: "Aladdin / Disney", wikiSlug: "Genie_(Disney)", hint: "Cosmic spirit of the lamp granting three wishes", traitVerification: "Immense blue-skinned magical jinn voiced by Robin Williams" },
      { name: "Dory", origin: "Finding Nemo / Pixar", wikiSlug: "Finding_Nemo", hint: 'Forgetful blue tang fish: "Just keep swimming"', traitVerification: "Royal blue tang fish with yellow fins" },
      { name: "Sadness", origin: "Inside Out / Pixar", wikiSlug: "Inside_Out_(2015_film)", hint: "Blue emotion in Riley's mind wearing a white knit sweater", traitVerification: "Blue-skinned teardrop emotion with blue hair" },
      { name: "Stitch (Experiment 626)", origin: "Lilo & Stitch", wikiSlug: "Stitch_(Lilo_%26_Stitch)", hint: "Mischievous blue genetic alien experiment in Hawaii", traitVerification: "Fluffy alien with dark blue and light blue fur" },
      { name: "Papa Smurf", origin: "The Smurfs", wikiSlug: "The_Smurfs", hint: "Leader of the tiny forest mushroom village", traitVerification: "Blue-skinned creature wearing a red Phrygian cap" },
      { name: "Megamind", origin: "DreamWorks", wikiSlug: "Megamind", hint: "Blue alien supervillain with a bulbous cranium", traitVerification: "Extraterrestrial with bright blue skin and oversized head" },
      { name: "Sulley", origin: "Monsters, Inc.", wikiSlug: "Sulley_(Monsters,_Inc.)", hint: "Top scarer at Monsters, Inc. with purple spots", traitVerification: "Giant monster covered in light blue/teal fur" },
      { name: "Mystique", origin: "Marvel / X-Men", wikiSlug: "Mystique_(comics)", hint: "Shapeshifting mutant with red hair and yellow eyes", traitVerification: "Natural true form has rich blue skin and scales" }
    ]
  },
  {
    id: "legendary-weapons",
    keywords: ["weapon", "sword", "hammer", "staff", "named weapon", "legendary, named weapon"],
    trait: "Both characters wield a legendary, named weapon (e.g., a specific sword, hammer, or staff).",
    name: "All characters wield a legendary named weapon",
    characters: [
      { name: "Thor", origin: "Marvel / Norse Mythology", wikiSlug: "Thor_(Marvel_Comics)", hint: "God of Thunder carrying the enchanted mallet Mjolnir", traitVerification: "Wields the mystical uru-forged hammer Mjolnir" },
      { name: "King Arthur", origin: "Arthurian Legend", wikiSlug: "King_Arthur", hint: "Legendary High King who drew the sword Excalibur", traitVerification: "Wields the legendary sword Excalibur gifted by the Lady of the Lake" },
      { name: "Luke Skywalker", origin: "Star Wars", wikiSlug: "Luke_Skywalker", hint: "Jedi Knight who forged his green lightsaber", traitVerification: "Wields his father Anakin's blue lightsaber and later his green lightsaber" },
      { name: "Frodo Baggins", origin: "The Lord of the Rings", wikiSlug: "Frodo_Baggins", hint: "Hobbit bearer carrying the elven dagger Sting", traitVerification: "Carries Sting, an elven blade that glows blue in the presence of orcs" },
      { name: "Aragorn", origin: "The Lord of the Rings", wikiSlug: "Aragorn", hint: "Heir of Elendil wielding the reforged blade And\xFAril", traitVerification: "Wields And\xFAril, the Flame of the West forged from Narsil" },
      { name: "Link", origin: "The Legend of Zelda", wikiSlug: "Link_(The_Legend_of_Zelda)", hint: "Chosen hero who draws the Master Sword", traitVerification: "Wields the legendary Master Sword, the Blade of Evil's Bane" },
      { name: "Wonder Woman (Diana Prince)", origin: "DC Comics", wikiSlug: "Wonder_Woman", hint: "Amazonian champion wielding the golden Lasso of Truth", traitVerification: "Wields the divine golden Lasso of Truth and God Killer blade" },
      { name: "Cloud Strife", origin: "Final Fantasy VII", wikiSlug: "Cloud_Strife", hint: "Ex-SOLDIER carrying the massive Buster Sword", traitVerification: "Iconically wields the legendary six-foot Buster Sword" },
      { name: "Percy Jackson", origin: "Rick Riordan", wikiSlug: "Percy_Jackson", hint: "Demigod son of Poseidon carrying the pen-sword Anaklusmos", traitVerification: "Wields Anaklusmos (Riptide), a celestial bronze sword disguised as a pen" },
      { name: "Geralt of Rivia", origin: "The Witcher", wikiSlug: "Geralt_of_Rivia", hint: "White Wolf wielding Aerondight and silver witcher swords", traitVerification: "Wields the legendary silver sword Aerondight gifted by the Lady of the Lake" },
      { name: "Inuyasha", origin: "Rumiko Takahashi", wikiSlug: "Inuyasha_(character)", hint: "Half-demon dog warrior wielding the Tessaiga blade", traitVerification: "Wields Tessaiga, the fang sword carved from his father's canine tooth" },
      { name: "Bilbo Baggins", origin: "The Hobbit", wikiSlug: "Bilbo_Baggins", hint: "Hobbit who discovered the glowing elven blade Sting", traitVerification: "Discovered and named the elven dagger Sting during the quest for Erebor" }
    ]
  },
  {
    id: "scars-eyepatches",
    keywords: ["scar", "eyepatch", "facial marking"],
    trait: "Both characters are known for an iconic scar, eyepatch, or facial marking.",
    name: "All characters have an iconic scar, eyepatch, or facial marking",
    characters: [
      { name: "Harry Potter", origin: "Harry Potter", wikiSlug: "Harry_Potter_(character)", hint: "The Boy Who Lived marked by a lightning bolt", traitVerification: "Famous for his lightning bolt scar carved by Voldemort's curse" },
      { name: "Nick Fury", origin: "Marvel", wikiSlug: "Nick_Fury", hint: "S.H.I.E.L.D. Director who wears a black eye patch", traitVerification: "Famous for his black leather eyepatch covering his blinded left eye" },
      { name: "Scar", origin: "The Lion King", wikiSlug: "Scar_(The_Lion_King)", hint: "Treacherous lion named for the slash across his eye", traitVerification: "Permanently scarred across his left eye, giving him his namesake" },
      { name: "Prince Zuko", origin: "Avatar: The Last Airbender", wikiSlug: "Zuko", hint: "Fire Nation prince with a burn mark over his left eye", traitVerification: "Bears a prominent red burn scar over his left eye from his father" },
      { name: "Kakashi Hatake", origin: "Naruto", wikiSlug: "Kakashi_Hatake", hint: "Copy Ninja with a vertical scar over his Sharingan eye", traitVerification: "Vertical scar over his left eye where Obito's Sharingan was implanted" },
      { name: "Geralt of Rivia", origin: "The Witcher", wikiSlug: "Geralt_of_Rivia", hint: "White Wolf with a deep dueling scar down his left cheek", traitVerification: "Has a prominent vertical scar across his left eye from a cockatrice" },
      { name: "Tony Montana", origin: "Scarface", wikiSlug: "Tony_Montana", hint: "Cuban refugee kingpin known as Scarface", traitVerification: "Prominent blade scar cutting down his right eyebrow and cheek" },
      { name: "Tyrion Lannister", origin: "Game of Thrones", wikiSlug: "Tyrion_Lannister", hint: "Hand of the King wounded at the Blackwater", traitVerification: "Slit across the face by Ser Mandon Moore leaving a jagged scar" },
      { name: "Big Boss (Naked Snake)", origin: "Metal Gear", wikiSlug: "Big_Boss_(Metal_Gear)", hint: "Legendary soldier wearing an eyepatch over his right eye", traitVerification: "Lost his right eye during torture by Volgin, wearing an eyepatch ever since" },
      { name: "Inigo Montoya", origin: "The Princess Bride", wikiSlug: "Inigo_Montoya", hint: "Swordsman seeking vengeance for his father", traitVerification: "Count Rugen slashed two distinct scars across both of his cheeks" },
      { name: "Monkey D. Luffy", origin: "One Piece", wikiSlug: "Monkey_D._Luffy", hint: "Straw Hat captain with a stitched scar under his eye", traitVerification: "Stabbed himself under his left eye as a child, leaving a stitched scar" }
    ]
  },
  {
    id: "superhuman-durability",
    keywords: ["superhuman durability", "regenerative healing", "healing factor", "durability"],
    trait: "Both characters possess superhuman durability or regenerative healing.",
    name: "All characters possess superhuman durability or regenerative healing",
    characters: [
      { name: "Wolverine (Logan)", origin: "Marvel", wikiSlug: "Wolverine_(character)", hint: "Mutant with adamantium skeleton and mutant healing factor", traitVerification: "Accelerated healing factor regenerates organs and bones instantly" },
      { name: "Deadpool (Wade Wilson)", origin: "Marvel", wikiSlug: "Deadpool", hint: "Merc with a mouth whose cancer-infused healing heals anything", traitVerification: "Extravagant regenerative healing factor re-attaches severed limbs" },
      { name: "Superman (Clark Kent)", origin: "DC Comics", wikiSlug: "Superman", hint: "Man of Steel whose Kryptonian cells repel bullets and lasers", traitVerification: "Virtually indestructible under yellow sunlight, repelling artillery" },
      { name: "Hulk (Bruce Banner)", origin: "Marvel", wikiSlug: "Hulk", hint: "Gamma giant whose skin resists nuclear blasts", traitVerification: "Skin resists heavy artillery and possesses extreme cellular regeneration" },
      { name: "The Terminator (T-800)", origin: "The Terminator", wikiSlug: "The_Terminator_(character)", hint: "Infiltration cybernetic unit with hyperalloy combat chassis", traitVerification: "Armored hyperalloy endoskeleton withstands heavy explosives and gunfire" },
      { name: "Luke Cage", origin: "Marvel", wikiSlug: "Luke_Cage", hint: "Power Man with titanium-dense skin that breaks needles", traitVerification: "Cellular experiment gave him impenetrable skin and dense muscle tissue" },
      { name: "Majin Buu", origin: "Dragon Ball", wikiSlug: "Majin_Buu", hint: "Pink magical menace whose body reassembles from smoke", traitVerification: "Body is completely pliable and can regenerate fully from microscopic smoke" },
      { name: "Godzilla", origin: "Toho", wikiSlug: "Godzilla", hint: "King of the Monsters with regenerative G-cells", traitVerification: "Armored reptilian scales and G-cells that rapidly heal military strikes" }
    ]
  },
  {
    id: "animal-companions",
    keywords: ["pet", "animal familiar", "animal companion", "accompanied by a loyal pet"],
    trait: "Both characters are accompanied by a loyal pet or animal familiar.",
    name: "All characters are accompanied by a loyal pet or animal familiar",
    characters: [
      { name: "Shaggy Rogers", origin: "Scooby-Doo", wikiSlug: "Shaggy_Rogers", hint: "Cowardly mystery solver who shares snacks with Scooby-Doo", traitVerification: "Always accompanied by his best friend and pet Great Dane Scooby-Doo" },
      { name: "Ash Ketchum", origin: "Pokemon", wikiSlug: "Ash_Ketchum", hint: "Pokemon trainer whose partner Pikachu rides on his shoulder", traitVerification: "Inseparable from his partner Pokemon Pikachu who travels outside a Pokeball" },
      { name: "Jon Snow", origin: "Game of Thrones", wikiSlug: "Jon_Snow_(character)", hint: "Lord Commander of the Night's Watch with Ghost the direwolf", traitVerification: "Bonded with Ghost, his loyal white albino direwolf companion" },
      { name: "Dorothy Gale", origin: "The Wizard of Oz", wikiSlug: "Dorothy_Gale", hint: "Kansas girl carried by a cyclone alongside Toto in a basket", traitVerification: "Never parts from Toto, her loyal black Cairn Terrier dog" },
      { name: "Tintin", origin: "Herge", wikiSlug: "Tintin_(character)", hint: "Intrepid boy reporter whose white terrier Snowy saves his life", traitVerification: "Accompanied on all investigative voyages by Snowy, his white wire fox terrier" },
      { name: "Wallace", origin: "Wallace & Gromit", wikiSlug: "Wallace_and_Gromit", hint: "Cheese-loving inventor living with his clever beagle Gromit", traitVerification: "Shares his home and inventions with Gromit, his brilliant silent dog" },
      { name: "Hiccup Horrendous Haddock III", origin: "How to Train Your Dragon", wikiSlug: "Hiccup_Horrendous_Haddock_III", hint: "Viking chief who flies into battle with Toothless the dragon", traitVerification: "Bonded with Toothless, the rare and loyal Night Fury dragon" },
      { name: "Aladdin", origin: "Disney / Arabian Nights", wikiSlug: "Aladdin_(Disney_character)", hint: "Street rat accompanied by the fez-wearing monkey Abu", traitVerification: "Accompanied everywhere by Abu, his clever pet capuchin monkey" },
      { name: "Charlie Brown", origin: "Peanuts", wikiSlug: "Charlie_Brown", hint: "Lovable loser boy whose pet beagle sleeps on a red doghouse", traitVerification: "Owner and companion of Snoopy the anthropomorphic beagle" },
      { name: "Rubeus Hagrid", origin: "Harry Potter", wikiSlug: "Rubeus_Hagrid", hint: "Hogwarts gamekeeper accompanied by Fang the boarhound", traitVerification: "Keeps Fang the boarhound as his loyal pet in his grounds cabin" }
    ]
  },
  {
    id: "breaking-fourth-wall",
    keywords: ["fourth wall", "break the fourth wall", "acknowledge the audience"],
    trait: "Both characters regularly break the fourth wall and acknowledge the audience.",
    name: "All characters regularly break the fourth wall and acknowledge the audience",
    characters: [
      { name: "Deadpool (Wade Wilson)", origin: "Marvel", wikiSlug: "Deadpool", hint: "Merc with a mouth who jokes about the comic writers and studio budget", traitVerification: "Routinely talks directly to readers and film viewers about comic/movie tropes" },
      { name: "Ferris Bueller", origin: "Ferris Bueller's Day Off", wikiSlug: "Ferris_Bueller", hint: "High school senior who stops to monologue directly to camera", traitVerification: "Frequently turns to address the cinema audience with life philosophies" },
      { name: "Fleabag", origin: "Fleabag / BBC", wikiSlug: "Fleabag", hint: "London woman who breaks eye contact to whisper to the camera", traitVerification: "Constantly turns to camera with witty, confessional side commentary" },
      { name: "She-Hulk (Jennifer Walters)", origin: "Marvel", wikiSlug: "She-Hulk", hint: "Superhuman lawyer who steps out of comic panels to argue", traitVerification: "Steps out of narrative frames and addresses the audience and writers" },
      { name: "Zack Morris", origin: "Saved by the Bell", wikiSlug: "Zack_Morris", hint: 'Bayside High student who calls "Time out!" to pause life', traitVerification: "Freezes all action around him to speak directly to the TV audience" },
      { name: "The Mask (Stanley Ipkiss)", origin: "Dark Horse / Film", wikiSlug: "The_Mask_(film)", hint: 'Green-faced trickster asking: "Somebody stop me!"', traitVerification: "Delivers wild cartoon asides and glances straight into the camera lens" },
      { name: "Malcolm", origin: "Malcolm in the Middle", wikiSlug: "Malcolm_in_the_Middle", hint: "Genius middle child who explains his chaotic family to camera", traitVerification: "Spends each episode confessing his frustrations directly into the lens" },
      { name: "Emperor Kuzco", origin: "The Emperor's New Groove", wikiSlug: "Kuzco", hint: "Incan emperor who pauses his own film to doodle on the frame", traitVerification: "Narrates the movie and interrupts scenes to tell the audience to focus on him" },
      { name: "Bugs Bunny", origin: "Looney Tunes", wikiSlug: "Bugs_Bunny", hint: "Munching a carrot and leaning out of the screen to chat", traitVerification: `Frequently breaks the fourth wall to ask the audience "What's up, doc?"` }
    ]
  },
  {
    id: "exiled-royalty",
    keywords: ["royalty", "exiled", "renounced their throne", "throne"],
    trait: "Both characters are royalty who were exiled or willingly renounced their throne.",
    name: "All characters are royalty who were exiled or renounced their throne",
    characters: [
      { name: "Aragorn", origin: "The Lord of the Rings", wikiSlug: "Aragorn", hint: "Heir of Isildur who lived in hiding as the ranger Strider", traitVerification: "Rightful King of Gondor living in humble exile as a ranger of the North" },
      { name: "Simba", origin: "The Lion King", wikiSlug: "Simba", hint: "Lion cub prince exiled into the jungle following his father's death", traitVerification: "Fled Pride Rock into foreign exile after Scar framed him for Mufasa's death" },
      { name: "Prince Zuko", origin: "Avatar: The Last Airbender", wikiSlug: "Zuko", hint: "Crown Prince of the Fire Nation banished to hunt the Avatar", traitVerification: "Banished from his homeland by Fire Lord Ozai in permanent royal exile" },
      { name: "Thor", origin: "Marvel", wikiSlug: "Thor_(Marvel_Comics)", hint: "Crown Prince of Asgard stripped of his royal hammer and cast to Earth", traitVerification: "Exiled from Asgard to Midgard as a mortal without powers by Odin" },
      { name: "Daenerys Targaryen", origin: "Game of Thrones", wikiSlug: "Daenerys_Targaryen", hint: "Exiled Targaryen princess surviving across Essos with dragons", traitVerification: "Born during Robert's Rebellion and lived entire youth in foreign exile" },
      { name: "Princess Leia Organa", origin: "Star Wars", wikiSlug: "Princess_Leia", hint: "Princess of Alderaan whose royal home was incinerated by Death Star", traitVerification: "Lost her entire royal world of Alderaan, leading the Rebellion in exile" },
      { name: "King Arthur", origin: "Arthurian Legend", wikiSlug: "King_Arthur", hint: "Hidden prince raised in obscurity by Sir Ector before drawing the blade", traitVerification: "Hidden away at birth by Merlin to live in obscurity before claiming crown" },
      { name: "Aquaman (Arthur Curry)", origin: "DC Comics", wikiSlug: "Aquaman", hint: "Atlantean royal heir who grew up on the surface as an outcast", traitVerification: "True heir to the throne of Atlantis who lived exiled on the human surface" },
      { name: "Emperor Kuzco", origin: "The Emperor's New Groove", wikiSlug: "Kuzco", hint: "Arrogant young emperor evicted from his palace into the jungle as a llama", traitVerification: "Usurped by Yzma and cast out of his imperial palace into peasant village" }
    ]
  },
  {
    id: "frozen-stasis",
    keywords: ["sealed away", "frozen", "stasis", "centuries before awakening"],
    trait: "Both characters were sealed away, frozen, or trapped in stasis for centuries before awakening.",
    name: "All characters were frozen or trapped in stasis for centuries",
    characters: [
      { name: "Captain America (Steve Rogers)", origin: "Marvel", wikiSlug: "Captain_America", hint: "Super-soldier frozen in Arctic ice from 1945 until modern day", traitVerification: "Preserved in cryogenic suspended animation inside an iceberg for 66 years" },
      { name: "Aang", origin: "Avatar: The Last Airbender", wikiSlug: "Aang", hint: "Last Airbender frozen inside a glowing sphere of ice for a century", traitVerification: "Trapped in an iceberg in the South Pole for 100 years in the Avatar State" },
      { name: "Philip J. Fry", origin: "Futurama", wikiSlug: "Philip_J._Fry", hint: "Pizza delivery boy who fell into a cryo tube on New Year's Eve 1999", traitVerification: "Accidentally cryogenically frozen for exactly 1,000 years until December 2999" },
      { name: "Austin Powers", origin: "Austin Powers", wikiSlug: "Austin_Powers", hint: "1960s secret agent cryogenically frozen until the late 1990s", traitVerification: "Frozen in cryogenic suspension in 1967 and defrosted thirty years later in 1997" },
      { name: "Master Chief", origin: "Halo", wikiSlug: "Master_Chief_(Halo)", hint: "Spartan-117 who enters cryo-sleep between galaxy-spanning battles", traitVerification: "Entered cryogenic hibernation in the aft section of the Forward Unto Dawn" },
      { name: "Demona", origin: "Gargoyles", wikiSlug: "Gargoyles_(TV_series)", hint: "Gargoyle clan leader locked in stone sleep for a thousand years", traitVerification: "Her clan was placed in stone slumber by a spell for a thousand years until Manhattan" },
      { name: "Rip Van Winkle", origin: "Washington Irving", wikiSlug: "Rip_Van_Winkle", hint: "Dutch-American villager who slept twenty years in the Catskills", traitVerification: "Drank mysterious liquor in the mountains and fell into a twenty-year slumber" },
      { name: "Link", origin: "The Legend of Zelda: Breath of the Wild", wikiSlug: "Link_(The_Legend_of_Zelda)", hint: "Hero who slumbered inside the Shrine of Resurrection for 100 years", traitVerification: "Sealed away inside the Shrine of Resurrection for 100 years following Calamity Ganon" }
    ]
  },
  {
    id: "legendary-mentors",
    keywords: ["mentor", "prot\xE9g\xE9", "impulsive or rebellious", "mentors an impulsive"],
    trait: "Both characters mentor an impulsive or rebellious younger prot\xE9g\xE9.",
    name: "All characters are wise mentors guiding an impulsive prot\xE9g\xE9",
    characters: [
      { name: "Yoda", origin: "Star Wars", wikiSlug: "Yoda", hint: "Jedi Grand Master training the impatient Luke Skywalker on Dagobah", traitVerification: "Trained the reckless, impatient young Luke Skywalker in the ways of the Force" },
      { name: "Obi-Wan Kenobi", origin: "Star Wars", wikiSlug: "Obi-Wan_Kenobi", hint: "Jedi Master who mentored the headstrong Anakin and young Luke", traitVerification: "Mentored the headstrong Anakin Skywalker and guided Luke in his early trials" },
      { name: "Mr. Miyagi", origin: "The Karate Kid", wikiSlug: "Mr._Miyagi", hint: "Okinawan karate master teaching Daniel LaRusso via chores", traitVerification: "Mentored the hot-tempered teenager Daniel LaRusso in karate and life balance" },
      { name: "Gandalf", origin: "The Lord of the Rings", wikiSlug: "Gandalf", hint: "Grey Wizard guiding the young and overwhelmed Frodo Baggins", traitVerification: "Guides and counsels the inexperienced young hobbit Frodo Baggins" },
      { name: "Albus Dumbledore", origin: "Harry Potter", wikiSlug: "Albus_Dumbledore", hint: "Hogwarts Headmaster guiding Harry through dangerous wizarding trials", traitVerification: "Carefully mentored and guided the impulsive young Harry Potter" },
      { name: "Haymitch Abernathy", origin: "The Hunger Games", wikiSlug: "Haymitch_Abernathy", hint: "Cynical victor mentoring the defiant Katniss Everdeen", traitVerification: "Mentored the rebellious Katniss Everdeen to navigate the Capitol arena" },
      { name: "Philoctetes", origin: "Disney / Greek Myth", wikiSlug: "Hercules_(1997_film)", hint: "Gruff satyr trainer of clumsy young heroes including Hercules", traitVerification: "Trained the clumsy, impatient young Hercules to become a true hero" },
      { name: "Professor X (Charles Xavier)", origin: "Marvel / X-Men", wikiSlug: "Professor_X", hint: "Telepathic founder tutoring impulsive young mutants at his school", traitVerification: "Founded Xavier's School to teach and mentor unruly young mutant youths" },
      { name: "Kakashi Hatake", origin: "Naruto", wikiSlug: "Kakashi_Hatake", hint: "Jonin sensei managing the defiant Naruto and vengeful Sasuke", traitVerification: "Leader and teacher of Team 7, guiding the loud, rebellious Naruto Uzumaki" }
    ]
  }
];

// src/data/themes.ts
var CURATED_THEMES = [
  {
    id: "glasses-spectacles",
    name: "All characters wear prominent glasses, spectacles, or goggles.",
    characters: [
      { name: "Harry Potter", origin: "Harry Potter", wikiSlug: "Harry_Potter_(character)", hint: "The Boy Who Lived with round spectacles" },
      { name: "Velma Dinkley", origin: "Scooby-Doo", wikiSlug: "Velma_Dinkley", hint: 'Mystery Inc. brain: "My glasses!"' },
      { name: "Clark Kent", origin: "DC Comics", wikiSlug: "Clark_Kent", hint: "Daily Planet reporter with horn-rimmed glasses" },
      { name: "Edna Mode", origin: "The Incredibles", wikiSlug: "Edna_Mode", hint: "Super-suit fashion designer with giant round specs" },
      { name: "Doc Brown", origin: "Back to the Future", wikiSlug: "Doc_Brown", hint: "Eccentric inventor wearing temporal goggles" },
      { name: "Walter White", origin: "Breaking Bad", wikiSlug: "Walter_White_(Breaking_Bad)", hint: "Chemistry teacher with wire-rimmed glasses" },
      { name: "Cyclops (Scott Summers)", origin: "Marvel / X-Men", wikiSlug: "Cyclops_(Marvel_Comics)", hint: "X-Men leader with ruby-quartz eyewear" },
      { name: "Arthur Read", origin: "Arthur / PBS", wikiSlug: "Arthur_Read", hint: "Beloved aardvark kid with round glasses" },
      { name: "Where's Waldo", origin: "Where's Waldo?", wikiSlug: "Where's_Wally%3F", hint: "Globetrotting wanderer in striped sweater and glasses" },
      { name: "Albus Dumbledore", origin: "Harry Potter", wikiSlug: "Albus_Dumbledore", hint: "Hogwarts Headmaster with half-moon spectacles" },
      { name: "Milhouse Van Houten", origin: "The Simpsons", wikiSlug: "Milhouse_Van_Houten", hint: "Springfield kid with thick red-framed glasses" },
      { name: "Simon Seville", origin: "Alvin and the Chipmunks", wikiSlug: "Alvin_and_the_Chipmunks", hint: "Intellectual chipmunk in blue with black glasses" },
      { name: "Steve Urkel", origin: "Family Matters", wikiSlug: "Steve_Urkel", hint: "Nerdy neighbor with oversized glasses" },
      { name: "Morpheus", origin: "The Matrix", wikiSlug: "Morpheus_(The_Matrix)", hint: "Nebuchadnezzar captain with frameless sunglasses" },
      { name: "Carl Wheezer", origin: "Jimmy Neutron", wikiSlug: "Jimmy_Neutron", hint: "Llama-loving boy with round spectacles" },
      { name: "Austin Powers", origin: "Austin Powers", wikiSlug: "Austin_Powers", hint: "Swinging 60s spy with thick black frames" },
      { name: "Professor Farnsworth", origin: "Futurama", wikiSlug: "Professor_Farnsworth", hint: "Planet Express owner with thick circular glasses" },
      { name: "Tina Belcher", origin: "Bob's Burgers", wikiSlug: "Tina_Belcher", hint: "Eldest Belcher daughter with rectangular glasses" },
      { name: "Dwight Schrute", origin: "The Office", wikiSlug: "Dwight_Schrute", hint: "Dunder Mifflin salesman with metal aviator glasses" },
      { name: "John Lennon", origin: "Pop Culture / Beatles", wikiSlug: "John_Lennon", hint: "Music legend famous for round wire glasses" }
    ]
  },
  {
    id: "caped-masked",
    name: "All characters wear a cape, cowl, or disguise mask.",
    characters: [
      { name: "Batman", origin: "DC Comics", wikiSlug: "Batman", hint: "The Dark Knight of Gotham" },
      { name: "Zorro", origin: "Zorro", wikiSlug: "Zorro", hint: "Swashbuckling vigilante with a black mask" },
      { name: "The Phantom of the Opera", origin: "Literature / Musical", wikiSlug: "The_Phantom_of_the_Opera_(character)", hint: "Haunts the Paris Opera House" },
      { name: "Edna Mode", origin: "The Incredibles", wikiSlug: "Edna_Mode", hint: 'Super-suit fashion designer: "No capes!"' },
      { name: "Count Dracula", origin: "Bram Stoker / Gothic Horror", wikiSlug: "Count_Dracula", hint: "Transylvanian vampire lord" },
      { name: "Darth Vader", origin: "Star Wars", wikiSlug: "Darth_Vader", hint: "Sith Lord in black armor and flowing cape" },
      { name: "Robin Hood", origin: "English Folklore", wikiSlug: "Robin_Hood", hint: "Hero of Sherwood Forest who steals from the rich" },
      { name: "Spider-Man", origin: "Marvel", wikiSlug: "Spider-Man", hint: "Friendly neighborhood web-slinger in full mask" },
      { name: "Superman", origin: "DC Comics", wikiSlug: "Superman", hint: "Man of Steel with red cape from Krypton" },
      { name: "V (V for Vendetta)", origin: "DC / Vertigo", wikiSlug: "V_(character)", hint: "Anarchist wearing a Guy Fawkes mask" },
      { name: "Deadpool", origin: "Marvel", wikiSlug: "Deadpool", hint: "Merc with a mouth in red-and-black mask" },
      { name: "Frodo Baggins", origin: "The Lord of the Rings", wikiSlug: "Frodo_Baggins", hint: "Hobbit bearing an elven cloak and brooch" }
    ]
  },
  {
    id: "master-sleuths",
    name: "All characters are famous for solving mysteries, crimes, or intricate puzzles.",
    characters: [
      { name: "Sherlock Holmes", origin: "Arthur Conan Doyle", wikiSlug: "Sherlock_Holmes", hint: "Consulting detective of 221B Baker Street" },
      { name: "Hercule Poirot", origin: "Agatha Christie", wikiSlug: "Hercule_Poirot", hint: "Belgian detective with tidy moustaches" },
      { name: "Scooby-Doo", origin: "Scooby-Doo / Hanna-Barbera", wikiSlug: "Scooby-Doo_(character)", hint: "Great Dane in the Mystery Machine" },
      { name: "Columbo", origin: "Columbo", wikiSlug: "Columbo_(character)", hint: 'Crumpled raincoat: "Just one more thing..."' },
      { name: "Nancy Drew", origin: "Nancy Drew Mystery Stories", wikiSlug: "Nancy_Drew", hint: "Teenage sleuth of River Heights" },
      { name: "Benoit Blanc", origin: "Knives Out", wikiSlug: "Benoit_Blanc", hint: "Southern gentleman detective with drawl" },
      { name: "Miss Marple", origin: "Agatha Christie", wikiSlug: "Miss_Marple", hint: "Elderly spinster amateur detective" },
      { name: "Batman", origin: "DC Comics", wikiSlug: "Batman", hint: "The World\u2019s Greatest Detective" },
      { name: "Veronica Mars", origin: "Veronica Mars", wikiSlug: "Veronica_Mars_(character)", hint: "High-school private investigator" },
      { name: "Inspector Clouseau", origin: "The Pink Panther", wikiSlug: "Inspector_Clouseau", hint: "Bumbling French police detective" },
      { name: "Ace Ventura", origin: "Ace Ventura", wikiSlug: "Ace_Ventura", hint: "Pet detective specializing in animal retrieval" },
      { name: "Velma Dinkley", origin: "Scooby-Doo", wikiSlug: "Velma_Dinkley", hint: 'Brain of Mystery Inc.: "Jinkies!"' }
    ]
  },
  {
    id: "iconic-healers",
    name: "All characters practice medicine, healing, surgery, or therapy.",
    characters: [
      { name: "Florence Nightingale", origin: "Historical Pioneer", wikiSlug: "Florence_Nightingale", hint: "The Lady with the Lamp / modern nursing pioneer" },
      { name: "Gregory House", origin: "House, M.D.", wikiSlug: "Gregory_House", hint: 'Misanthropic diagnostic genius: "Everybody lies"' },
      { name: "Doctor Strange", origin: "Marvel", wikiSlug: "Doctor_Strange", hint: "Master of the Mystic Arts and neurosurgeon" },
      { name: "Sigmund Freud", origin: "Historical Psychoanalyst", wikiSlug: "Sigmund_Freud", hint: "Founder of psychoanalysis" },
      { name: "Doc Brown", origin: "Back to the Future", wikiSlug: "Doc_Brown", hint: "Inventor of the DeLorean time machine" },
      { name: "Meredith Grey", origin: "Grey's Anatomy", wikiSlug: "Meredith_Grey", hint: "Chief of Surgery at Grey Sloan Memorial" },
      { name: "Leonard McCoy", origin: "Star Trek", wikiSlug: "Leonard_McCoy", hint: 'Starfleet chief medical officer: "Bones"' },
      { name: "Hippocrates", origin: "Ancient Greece", wikiSlug: "Hippocrates", hint: "Ancient Greek physician and oath namesake" },
      { name: "Doc Holliday", origin: "American Old West", wikiSlug: "Doc_Holliday", hint: "Dentist, gunfighter, and gambler of the Wild West" },
      { name: "Patch Adams", origin: "Real Life / Film", wikiSlug: "Patch_Adams", hint: "Physician known for treating patients with humor" },
      { name: "Alexander Fleming", origin: "Historical Scientist", wikiSlug: "Alexander_Fleming", hint: "Biologist who discovered penicillin" },
      { name: "Clara Barton", origin: "American Red Cross", wikiSlug: "Clara_Barton", hint: "Civil War battlefield nurse and Red Cross founder" }
    ]
  },
  {
    id: "cosmic-explorers",
    name: "All characters travel through the stars, outer space, or distant galaxies.",
    characters: [
      { name: "Buzz Lightyear", origin: "Toy Story / Pixar", wikiSlug: "Buzz_Lightyear", hint: 'Space Ranger: "To infinity and beyond!"' },
      { name: "Neil Armstrong", origin: "NASA / Space History", wikiSlug: "Neil_Armstrong", hint: "First human to walk on the Moon" },
      { name: "Princess Leia", origin: "Star Wars", wikiSlug: "Princess_Leia", hint: "Rebel Alliance leader and Alderaan princess" },
      { name: "James T. Kirk", origin: "Star Trek", wikiSlug: "James_T._Kirk", hint: "Captain of the USS Enterprise" },
      { name: "The Doctor", origin: "Doctor Who", wikiSlug: "The_Doctor_(Doctor_Who)", hint: "Time Lord traveling in the TARDIS" },
      { name: "Ellen Ripley", origin: "Alien", wikiSlug: "Ellen_Ripley", hint: "Sole survivor of the Nostromo" },
      { name: "Luke Skywalker", origin: "Star Wars", wikiSlug: "Luke_Skywalker", hint: "Jedi Knight from Tatooine" },
      { name: "Spock", origin: "Star Trek", wikiSlug: "Spock", hint: "Half-Vulcan first science officer" },
      { name: "Yuri Gagarin", origin: "Soviet Space Program", wikiSlug: "Yuri_Gagarin", hint: "First human in outer space" },
      { name: "Han Solo", origin: "Star Wars", wikiSlug: "Han_Solo", hint: "Smuggler and pilot of the Millennium Falcon" },
      { name: "E.T. the Extra-Terrestrial", origin: "E.T. the Extra-Terrestrial", wikiSlug: "E.T._the_Extra-Terrestrial_(character)", hint: "Gentle alien seeking to phone home" },
      { name: "Sally Ride", origin: "NASA / Space History", wikiSlug: "Sally_Ride", hint: "First American woman in space" }
    ]
  },
  {
    id: "legendary-rulers",
    name: "All characters held royal court, wore crowns, or commanded empires.",
    characters: [
      { name: "Cleopatra", origin: "Ancient Egypt", wikiSlug: "Cleopatra", hint: "Last active ruler of the Ptolemaic Kingdom of Egypt" },
      { name: "King Arthur", origin: "Arthurian Legend", wikiSlug: "King_Arthur", hint: "Legendary British monarch of the Round Table" },
      { name: "Queen Elizabeth II", origin: "British Monarchy", wikiSlug: "Elizabeth_II", hint: "Longest-reigning British monarch" },
      { name: "Julius Caesar", origin: "Ancient Rome", wikiSlug: "Julius_Caesar", hint: "Roman general and perpetual dictator" },
      { name: "Mufasa", origin: "The Lion King / Disney", wikiSlug: "Mufasa", hint: "King of the Pride Lands in The Lion King" },
      { name: "Napoleon Bonaparte", origin: "French Empire", wikiSlug: "Napoleon", hint: "Emperor of the French and military commander" },
      { name: "Alexander the Great", origin: "Ancient Macedonia", wikiSlug: "Alexander_the_Great", hint: "King of Macedonia who conquered the Persian Empire" },
      { name: "Queen Victoria", origin: "British Monarchy", wikiSlug: "Queen_Victoria", hint: "Empress of India who reigned during Victorian era" },
      { name: "Genghis Khan", origin: "Mongol Empire", wikiSlug: "Genghis_Khan", hint: "Founder and Great Khan of the Mongol Empire" },
      { name: "Henry VIII", origin: "Tudor England", wikiSlug: "Henry_VIII", hint: "Tudor King known for his six wives" },
      { name: "King Tutankhamun", origin: "Ancient Egypt", wikiSlug: "Tutankhamun", hint: "Boy pharaoh of the 18th Dynasty" },
      { name: "Aragorn", origin: "The Lord of the Rings", wikiSlug: "Aragorn", hint: "High King of Gondor and Arnor" }
    ]
  },
  {
    id: "famous-cooks",
    name: "All characters are known for making, serving, judging, or obsessing over food.",
    characters: [
      { name: "Gordon Ramsay", origin: "Celebrity Chef / TV", wikiSlug: "Gordon_Ramsay", hint: "Fiery Michelin-starred chef and TV host" },
      { name: "Julia Child", origin: "Culinary Icon", wikiSlug: "Julia_Child", hint: "Brought French cuisine to American homes" },
      { name: "Remy (Ratatouille)", origin: "Ratatouille / Pixar", wikiSlug: "Remy_(Ratatouille)", hint: "Ambitious Parisian rat with extraordinary palate" },
      { name: "Colonel Sanders", origin: "KFC / Pop Culture", wikiSlug: "Colonel_Sanders", hint: "Founder of Kentucky Fried Chicken" },
      { name: "Cookie Monster", origin: "Sesame Street", wikiSlug: "Cookie_Monster", hint: "Sesame Street resident craving round baked treats" },
      { name: "Guy Fieri", origin: "Food Network", wikiSlug: "Guy_Fieri", hint: "Mayor of Flavortown and host of Triple D" },
      { name: "Paul Hollywood", origin: "Great British Baking Show", wikiSlug: "Paul_Hollywood", hint: "Master baker giving famous handshakes" },
      { name: "SpongeBob SquarePants", origin: "Nickelodeon", wikiSlug: "SpongeBob_SquarePants_(character)", hint: "Krabby Patty fry cook at the Krusty Krab" },
      { name: "Wolfgang Puck", origin: "Celebrity Chef", wikiSlug: "Wolfgang_Puck", hint: "Celebrity chef behind Spago and Oscars catering" },
      { name: "Anthony Bourdain", origin: "Author & Travel Host", wikiSlug: "Anthony_Bourdain", hint: "Chef, author, and intrepid culinary traveler" },
      { name: "Willy Wonka", origin: "Roald Dahl", wikiSlug: "Willy_Wonka", hint: "Eccentric candy maker and chocolate factory owner" },
      { name: "Swedish Chef", origin: "The Muppets", wikiSlug: "Swedish_Chef", hint: 'Muppet kitchen artist singing "Bork Bork Bork!"' }
    ]
  },
  {
    id: "mythical-legends",
    name: "All characters are figures, monsters, or deities of mythology and folklore.",
    characters: [
      { name: "Zeus", origin: "Greek Mythology", wikiSlug: "Zeus", hint: "King of Mount Olympus wielding thunderbolts" },
      { name: "Medusa", origin: "Greek Mythology", wikiSlug: "Medusa", hint: "Gorgon with serpent hair whose gaze turns to stone" },
      { name: "Thor", origin: "Norse Mythology", wikiSlug: "Thor", hint: "Norse hammer-wielding god of thunder" },
      { name: "Hercules", origin: "Greek & Roman Mythology", wikiSlug: "Heracles", hint: "Hero known for twelve superhuman labors" },
      { name: "Loch Ness Monster", origin: "Scottish Folklore", wikiSlug: "Loch_Ness_Monster", hint: "Cryptid creature residing in Scottish highlands" },
      { name: "Anubis", origin: "Egyptian Mythology", wikiSlug: "Anubis", hint: "Jackal-headed ancient Egyptian god of mummification" },
      { name: "Robin Hood", origin: "English Folklore", wikiSlug: "Robin_Hood", hint: "Outlaw of Sherwood Forest folk tradition" },
      { name: "King Midas", origin: "Greek Mythology", wikiSlug: "Midas", hint: "Ruler whose touch turned everything into gold" },
      { name: "Poseidon", origin: "Greek Mythology", wikiSlug: "Poseidon", hint: "God of the sea and storms carrying a trident" },
      { name: "Pandora", origin: "Greek Mythology", wikiSlug: "Pandora", hint: "First mortal woman who opened a fateful jar/box" }
    ]
  }
];

// src/data/soloOracleEngine.ts
var FEMALE_CHARACTERS = /* @__PURE__ */ new Set([
  "velma dinkley",
  "edna mode",
  "roz",
  "tina belcher",
  "daria morgendorffer",
  "carmen sandiego",
  "imperator furiosa",
  "furiosa",
  "nancy drew",
  "miss marple",
  "veronica mars",
  "hermione granger",
  "scarlet witch (wanda maximoff)",
  "scarlet witch",
  "wanda maximoff",
  "maleficent",
  "zatanna",
  "julia child",
  "monica geller",
  "gamora",
  "poison ivy",
  "dory",
  "sadness",
  "mystique",
  "wonder woman (diana prince)",
  "wonder woman",
  "dorothy gale",
  "fleabag",
  "she-hulk (jennifer walters)",
  "she-hulk",
  "daenerys targaryen",
  "princess leia organa",
  "princess leia",
  "demona",
  "florence nightingale",
  "meredith grey",
  "clara barton",
  "ellen ripley",
  "sally ride",
  "cleopatra",
  "queen elizabeth ii",
  "queen victoria",
  "medusa",
  "pandora"
]);
var NON_HUMAN_CHARACTERS = /* @__PURE__ */ new Set([
  "arthur read",
  "simon seville",
  "professor farnsworth",
  // human, wait - remove from non-human
  "roz",
  "the cat in the hat",
  "paddington bear",
  "saitama",
  // human
  "lord voldemort",
  // human/dark wizard
  "thanos",
  "drax the destroyer",
  "kratos",
  // demigod/god
  "master chief",
  // human cyborg
  "general grievous",
  "scooby-doo",
  "mufasa",
  "marlin",
  "goofy",
  "the doctor",
  "the terminator (t-800)",
  "trunks",
  // half-saiyan
  "remy (ratatouille)",
  "spongebob squarepants",
  "garfield",
  "cookie monster",
  "hulk (bruce banner)",
  // human/mutate
  "yoda",
  "shrek",
  "kermit the frog",
  "the grinch",
  "piccolo",
  "mike wazowski",
  "gamora",
  "sonic the hedgehog",
  "mega man",
  "genie",
  "dory",
  "sadness",
  "stitch (experiment 626)",
  "papa smurf",
  "megamind",
  "sulley",
  "thor",
  "frodo baggins",
  "link",
  "wonder woman (diana prince)",
  "inuyasha",
  "bilbo baggins",
  "scar",
  "majin buu",
  "godzilla",
  "bugs bunny",
  "simba",
  "demona",
  "philoctetes",
  "e.t. the extra-terrestrial",
  "spock",
  "count dracula",
  "zeus",
  "medusa",
  "loch ness monster",
  "anubis",
  "poseidon"
]);
NON_HUMAN_CHARACTERS.delete("professor farnsworth");
NON_HUMAN_CHARACTERS.delete("saitama");
NON_HUMAN_CHARACTERS.delete("lord voldemort");
NON_HUMAN_CHARACTERS.delete("master chief");
NON_HUMAN_CHARACTERS.delete("hulk (bruce banner)");
var ANIMAL_CHARACTERS = /* @__PURE__ */ new Set([
  "arthur read",
  "simon seville",
  "the cat in the hat",
  "paddington bear",
  "scooby-doo",
  "mufasa",
  "marlin",
  "goofy",
  "remy (ratatouille)",
  "spongebob squarepants",
  "garfield",
  "kermit the frog",
  "sonic the hedgehog",
  "dory",
  "stitch (experiment 626)",
  "scar",
  "godzilla",
  "bugs bunny",
  "simba",
  "loch ness monster"
]);
var REAL_HISTORICAL_PEOPLE = /* @__PURE__ */ new Set([
  "john lennon",
  "abraham lincoln",
  "slash",
  "gordon ramsay",
  "julia child",
  "guy fieri",
  "rey mysterio",
  "florence nightingale",
  "sigmund freud",
  "hippocrates",
  "doc holliday",
  "patch adams",
  "alexander fleming",
  "clara barton",
  "neil armstrong",
  "yuri gagarin",
  "sally ride",
  "cleopatra",
  "queen elizabeth ii",
  "julius caesar",
  "napoleon bonaparte",
  "alexander the great",
  "queen victoria",
  "genghis khan",
  "henry viii",
  "king tutankhamun",
  "colonel sanders",
  "paul hollywood",
  "wolfgang puck",
  "anthony bourdain"
]);
var VILLAIN_CHARACTERS = /* @__PURE__ */ new Set([
  "walter white",
  "walter white (heisenberg)",
  "freddy krueger",
  "carmen sandiego",
  "lord voldemort",
  "gru",
  "lex luthor",
  "thanos",
  "dr. evil",
  "ernst stavro blofeld",
  "darth vader",
  "boba fett",
  "ghostface",
  "the phantom of the opera",
  "jason voorhees",
  "kylo ren",
  "bane",
  "shredder",
  "general grievous",
  "captain hook",
  "maleficent",
  "the terminator (t-800)",
  "the grinch",
  "poison ivy",
  "megamind",
  "mystique",
  "scar",
  "tony montana",
  "majin buu",
  "godzilla",
  "demona",
  "count dracula",
  "medusa"
]);
var ANIMATED_CHARACTERS = /* @__PURE__ */ new Set([
  "velma dinkley",
  "edna mode",
  "arthur read",
  "milhouse van houten",
  "simon seville",
  "carl wheezer",
  "professor farnsworth",
  "roz",
  "tina belcher",
  "daria morgendorffer",
  "dexter",
  "woody",
  "monkey d. luffy",
  "carmen sandiego",
  "paddington bear",
  "ash ketchum",
  "inspector gadget",
  "saitama",
  "homer simpson",
  "gru",
  "aang",
  "krillin",
  "mr. clean",
  "popeye the sailor",
  "charlie brown",
  "shredder",
  "edward elric",
  "captain hook",
  "finn the human",
  "scooby-doo",
  "maleficent",
  "mufasa",
  "bob parr (mr. incredible)",
  "peter griffin",
  "marlin",
  "geppetto",
  "goofy",
  "trunks",
  "remy (ratatouille)",
  "spongebob squarepants",
  "sanji",
  "garfield",
  "shrek",
  "the grinch",
  "piccolo",
  "mike wazowski",
  "peter pan",
  "sonic the hedgehog",
  "genie",
  "dory",
  "sadness",
  "stitch (experiment 626)",
  "papa smurf",
  "megamind",
  "sulley",
  "inuyasha",
  "scar",
  "prince zuko",
  "kakashi hatake",
  "majin buu",
  "shaggy rogers",
  "tintin",
  "wallace",
  "hiccup horrendous haddock iii",
  "aladdin",
  "emperor kuzco",
  "bugs bunny",
  "simba",
  "philip j. fry",
  "demona",
  "philoctetes",
  "buzz lightyear"
]);
var ANIME_MANGA_CHARACTERS = /* @__PURE__ */ new Set([
  "monkey d. luffy",
  "ash ketchum",
  "saitama",
  "krillin",
  "edward elric",
  "trunks",
  "sanji",
  "piccolo",
  "inuyasha",
  "kakashi hatake",
  "majin buu"
]);
var VIDEO_GAME_CHARACTERS = /* @__PURE__ */ new Set([
  "mario",
  "master chief",
  "raiden",
  "barret wallace",
  "jax briggs",
  "joel miller",
  "luigi",
  "sonic the hedgehog",
  "mega man",
  "link",
  "cloud strife",
  "geralt of rivia",
  "big boss (naked snake)",
  "kratos",
  "ash ketchum",
  "carmen sandiego"
]);
var COMIC_SUPERHERO_CHARACTERS = /* @__PURE__ */ new Set([
  "clark kent",
  "cyclops (scott summers)",
  "professor x (charles xavier)",
  "lex luthor",
  "thanos",
  "drax the destroyer",
  "batman (bruce wayne)",
  "batman",
  "spider-man (peter parker)",
  "spider-man",
  "deadpool (wade wilson)",
  "deadpool",
  "rorschach",
  "v (v for vendetta)",
  "iron man (tony stark)",
  "bane",
  "winter soldier (bucky barnes)",
  "cyborg (victor stone)",
  "cable (nathan summers)",
  "cable",
  "doctor strange",
  "scarlet witch (wanda maximoff)",
  "zatanna",
  "john constantine",
  "the flash (barry allen)",
  "hulk (bruce banner)",
  "gamora",
  "poison ivy",
  "mystique",
  "thor",
  "wonder woman (diana prince)",
  "nick fury",
  "wolverine (logan)",
  "superman (clark kent)",
  "superman",
  "luke cage",
  "she-hulk (jennifer walters)",
  "aquaman (arthur curry)",
  "captain america (steve rogers)",
  "edna mode",
  "bob parr (mr. incredible)",
  "saitama",
  "the mask (stanley ipkiss)"
]);
var YOUNG_CHARACTERS = /* @__PURE__ */ new Set([
  "harry potter",
  "velma dinkley",
  "arthur read",
  "milhouse van houten",
  "simon seville",
  "steve urkel",
  "carl wheezer",
  "tina belcher",
  "daria morgendorffer",
  "dexter",
  "monkey d. luffy",
  "ash ketchum",
  "aang",
  "charlie brown",
  "spider-man (peter parker)",
  "spider-man",
  "edward elric",
  "finn the human",
  "nancy drew",
  "veronica mars",
  "hermione granger",
  "marty mcfly",
  "trunks",
  "bill s. preston",
  "peter pan",
  "link",
  "percy jackson",
  "prince zuko",
  "shaggy rogers",
  "dorothy gale",
  "tintin",
  "hiccup horrendous haddock iii",
  "aladdin",
  "ferris bueller",
  "zack morris",
  "malcolm",
  "emperor kuzco",
  "simba",
  "king tutankhamun"
]);
function getCharacterCategories(charName) {
  const lower = charName.toLowerCase();
  const baseName = lower.replace(/\s*\(.*?\)\s*/g, "").trim();
  const traits = [];
  for (const cat of VERIFIED_CATEGORIES) {
    const found = cat.characters.some((c) => {
      const cLow = c.name.toLowerCase();
      const cBase = cLow.replace(/\s*\(.*?\)\s*/g, "").trim();
      return cLow === lower || cBase === baseName;
    });
    if (found) {
      traits.push(cat.id, cat.trait.toLowerCase(), cat.name.toLowerCase());
    }
  }
  for (const theme of CURATED_THEMES) {
    const found = theme.characters.some((c) => {
      const cLow = c.name.toLowerCase();
      const cBase = cLow.replace(/\s*\(.*?\)\s*/g, "").trim();
      return cLow === lower || cBase === baseName;
    });
    if (found) {
      traits.push(theme.id, theme.name.toLowerCase());
    }
  }
  return traits;
}
function normalizeForMatch(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['’`".-]/g, " ").replace(/\b(the|mr|mrs|ms|dr|sir|lord|lady|captain|capt|professor|prof|prince|princess|king|queen|emperor|master|general|inspector)\b/g, " ").replace(/\s+/g, " ").trim();
}
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const dp = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}
function checkCharacterGuess(rawGuess, secretChar) {
  const cleanedGuess = rawGuess.replace(/^(am i|is it|is my character|are they|could it be|i guess|my guess is)\s+/i, "").replace(/[?!.]+$/g, "").trim();
  if (!cleanedGuess || cleanedGuess.length < 2) {
    return { isCorrect: false, isSameOrigin: false };
  }
  const guessNorm = normalizeForMatch(cleanedGuess);
  const fullSecretNorm = normalizeForMatch(secretChar.name);
  const aliasMatches = [...secretChar.name.matchAll(/\(([^)]+)\)/g)].map(
    (m) => normalizeForMatch(m[1])
  );
  const outsideParens = normalizeForMatch(secretChar.name.replace(/\([^)]*\)/g, ""));
  const candidateTargets = /* @__PURE__ */ new Set([
    fullSecretNorm,
    outsideParens,
    ...aliasMatches
  ]);
  for (const part of [outsideParens, ...aliasMatches]) {
    const tokens = part.split(" ").filter((t) => t.length >= 4);
    if (tokens.length === 1) {
      candidateTargets.add(tokens[0]);
    } else if (tokens.length >= 2) {
      const genericFirstNames = /* @__PURE__ */ new Set([
        "john",
        "james",
        "peter",
        "walter",
        "charles",
        "arthur",
        "robert",
        "william",
        "michael",
        "david",
        "richard",
        "thomas",
        "martin",
        "scott",
        "bruce",
        "clark",
        "barry",
        "steve",
        "tony",
        "luke",
        "simon",
        "victor",
        "nathan"
      ]);
      const first = tokens[0];
      const last = tokens[tokens.length - 1];
      if (last.length >= 4) candidateTargets.add(last);
      if (first.length >= 5 && !genericFirstNames.has(first)) {
        candidateTargets.add(first);
      }
    }
  }
  for (const target of candidateTargets) {
    if (!target) continue;
    if (guessNorm === target) {
      return { isCorrect: true, isSameOrigin: true };
    }
    if (target.length >= 6 && guessNorm.length >= 5 && editDistance(guessNorm, target) <= 1) {
      return { isCorrect: true, isSameOrigin: true };
    }
    if (target.length >= 9 && guessNorm.length >= 7 && editDistance(guessNorm, target) <= 2) {
      return { isCorrect: true, isSameOrigin: true };
    }
  }
  let isSameOrigin = false;
  if (secretChar.origin) {
    const secretOriginNorm = secretChar.origin.toLowerCase();
    for (const cat of VERIFIED_CATEGORIES) {
      for (const c of cat.characters) {
        const cNorm = normalizeForMatch(c.name.replace(/\([^)]*\)/g, ""));
        if (cNorm === guessNorm && c.origin.toLowerCase() === secretOriginNorm) {
          isSameOrigin = true;
          break;
        }
      }
    }
  }
  return { isCorrect: false, isSameOrigin };
}
function evaluateSoloQuestion(rawQuestion, secretChar, themeName = "") {
  const q = rawQuestion.trim().toLowerCase();
  const charLower = secretChar.name.toLowerCase();
  const charBase = charLower.replace(/\s*\(.*?\)\s*/g, "").trim();
  const originLower = (secretChar.origin || "").toLowerCase();
  const hintLower = (secretChar.hint || "").toLowerCase();
  const verifyLower = (secretChar.traitVerification || "").toLowerCase();
  const combinedCorpus = `${charLower} ${originLower} ${hintLower} ${verifyLower} ${themeName.toLowerCase()}`;
  const charCategories = getCharacterCategories(secretChar.name);
  const fullCorpus = `${combinedCorpus} ${charCategories.join(" ")}`;
  const { isCorrect } = checkCharacterGuess(rawQuestion, secretChar);
  if (isCorrect) {
    return {
      verdict: "YES",
      answerText: `By the Royal Crown\u2014YES! You have unmasked your secret identity!`,
      isDirectGuess: true,
      guessedCharacterMatch: true
    };
  }
  const isFemale = FEMALE_CHARACTERS.has(charLower) || FEMALE_CHARACTERS.has(charBase);
  const isReal = REAL_HISTORICAL_PEOPLE.has(charLower) || REAL_HISTORICAL_PEOPLE.has(charBase);
  const isNonHuman = NON_HUMAN_CHARACTERS.has(charLower) || NON_HUMAN_CHARACTERS.has(charBase);
  const isAnimal = ANIMAL_CHARACTERS.has(charLower) || ANIMAL_CHARACTERS.has(charBase);
  const isVillain = VILLAIN_CHARACTERS.has(charLower) || VILLAIN_CHARACTERS.has(charBase);
  const isAnimated = ANIMATED_CHARACTERS.has(charLower) || ANIMATED_CHARACTERS.has(charBase);
  const isAnime = ANIME_MANGA_CHARACTERS.has(charLower) || ANIME_MANGA_CHARACTERS.has(charBase);
  const isVideoGame = VIDEO_GAME_CHARACTERS.has(charLower) || VIDEO_GAME_CHARACTERS.has(charBase);
  const isComic = COMIC_SUPERHERO_CHARACTERS.has(charLower) || COMIC_SUPERHERO_CHARACTERS.has(charBase);
  const isYoung = YOUNG_CHARACTERS.has(charLower) || YOUNG_CHARACTERS.has(charBase);
  if (/\b(female|woman|women|girl|lady|she|her|actress|queen|princess|mother|mom|sister|daughter)\b/.test(q) && !/\b(male|man|boy)\b/.test(q)) {
    return isFemale ? { verdict: "YES", answerText: "Aye! Your secret identity is female." } : { verdict: "NO", answerText: "Nay! Your character is not female." };
  }
  if (/\b(male|man|men|boy|guy|he|him|his|gentleman|king|prince)\b/.test(q)) {
    if (/\b(father|dad|paternal)\b/.test(q)) {
      const isFather = charCategories.includes("fathers") || /\b(father|dad|son|daughter)\b/.test(fullCorpus);
      return isFather ? { verdict: "YES", answerText: "Aye! Your character is indeed a father." } : { verdict: "NO", answerText: "Nay, they are not known for being a father." };
    }
    return !isFemale ? { verdict: "YES", answerText: "Aye! Your secret identity is male." } : { verdict: "NO", answerText: "Nay! Your character is not male." };
  }
  if (/\b(real|historical|real life|actual person|non-fiction|existed|living|celebrity|biographical)\b/.test(q)) {
    return isReal ? { verdict: "YES", answerText: "Aye! They walked the real world as a historical or living figure." } : { verdict: "NO", answerText: "Nay! Your character hails from the realms of fiction." };
  }
  if (/\b(fictional|fiction|made up|imaginary)\b/.test(q)) {
    return !isReal ? { verdict: "YES", answerText: "Aye! Your character is a fictional creation." } : { verdict: "NO", answerText: "Nay! They are a real figure from history or our world." };
  }
  if (/\b(human|mortal|person)\b/.test(q) && !/\b(superhuman|non-human)\b/.test(q)) {
    return !isNonHuman ? { verdict: "YES", answerText: "Aye! Your character is human." } : { verdict: "NO", answerText: "Nay! They are not an ordinary human." };
  }
  if (/\b(animal|beast|creature|dog|cat|bear|frog|fish|rat|lion|monkey|hedgehog|bird|monster)\b/.test(q)) {
    if (/\b(pet|companion|familiar|sidekick)\b/.test(q)) {
      const hasPet = charCategories.includes("animal-companions") || /\b(pet|dog|companion|pikachu|scooby|toto|snowy|gromit|toothless|abu|snoopy|fang)\b/.test(fullCorpus);
      return hasPet ? { verdict: "YES", answerText: "Aye! They are accompanied by a loyal animal companion." } : { verdict: "NO", answerText: "Nay, they are not known for a signature pet or animal familiar." };
    }
    const isCreature = isAnimal || isNonHuman;
    return isCreature ? { verdict: "YES", answerText: "Aye! They are a non-human creature, animal, or extraordinary being." } : { verdict: "NO", answerText: "Nay! Your character is human, not an animal or monster." };
  }
  if (/\b(alien|extraterrestrial|outer space|another planet|martian|kryptonian)\b/.test(q)) {
    const isAlien = /\b(alien|extraterrestrial|krypton|titan|namekian|gallifrey|time lord|vulcan|dagobah|experiment 626|zehoberei|apokolip)\b/.test(fullCorpus) || ["yoda", "thanos", "drax the destroyer", "gamora", "superman (clark kent)", "clark kent", "superman", "stitch (experiment 626)", "megamind", "the doctor", "piccolo", "trunks", "majin buu", "spock", "e.t. the extra-terrestrial"].includes(charLower);
    return isAlien ? { verdict: "YES", answerText: "Aye! They hail from beyond Earth or an extraterrestrial lineage." } : { verdict: "NO", answerText: "Nay! They are not an alien from another planet." };
  }
  if (/\b(robot|cyborg|android|machine|bionic|prosthetic|cybernetic|artificial|automail)\b/.test(q)) {
    const isCyber = charCategories.includes("cybernetic-robotic-limbs") || /\b(robot|cyborg|android|cybernetic|prosthetic|bionic|automail|hyperalloy|mechanical)\b/.test(fullCorpus) || ["mega man", "the terminator (t-800)", "darth vader", "cyborg (victor stone)", "general grievous", "inspector gadget", "raiden"].includes(charLower);
    return isCyber ? { verdict: "YES", answerText: "Aye! They possess cybernetic, robotic, or prosthetic enhancements." } : { verdict: "NO", answerText: "Nay! They are neither robot nor cyborg." };
  }
  if (/\b(anime|manga|japanese)\b/.test(q)) {
    const isJp = isAnime || /\b(nintendo|sega|capcom|final fantasy|pokemon|zelda|mario|luigi|sonic|naruto|one piece|dragon ball|fullmetal|one punch|toho|godzilla|metal gear)\b/.test(fullCorpus);
    return isJp ? { verdict: "YES", answerText: "Aye! They hail from anime, manga, or Japanese pop culture." } : { verdict: "NO", answerText: "Nay! They are not from anime or Japanese media." };
  }
  if (/\b(animated|animation|cartoon|pixar|dreamworks|disney|2d|3d|drawn)\b/.test(q)) {
    const matchesAnim = isAnimated || /\b(disney|pixar|dreamworks|nickelodeon|cartoon|simpsons|futurama|scooby|looney tunes|muppet|pbs|peanuts|hanna-barbera)\b/.test(fullCorpus);
    return matchesAnim ? { verdict: "YES", answerText: "Aye! Your character is famously depicted in animation or cartoons." } : { verdict: "NO", answerText: "Nay! They are primarily known from live-action, history, or non-animated works." };
  }
  if (/\b(video game|videogame|game|gaming|gamer|nintendo|playstation|xbox|arcade)\b/.test(q)) {
    return isVideoGame ? { verdict: "YES", answerText: "Aye! They are iconic in the world of video games." } : { verdict: "NO", answerText: "Nay! They did not originate as a video game character." };
  }
  if (/\b(comic|comics|superhero|marvel|dc|avengers|justice league|x-men|mutant)\b/.test(q)) {
    if (/\b(marvel|avengers|x-men)\b/.test(q) && !/\bdc\b/.test(q)) {
      const isMarvel = /\b(marvel|x-men)\b/.test(fullCorpus);
      return isMarvel ? { verdict: "YES", answerText: "Aye! They belong to the Marvel universe." } : { verdict: "NO", answerText: "Nay! They are not from Marvel." };
    }
    if (/\b(dc|gotham|krypton|justice league)\b/.test(q) && !/\bmarvel\b/.test(q)) {
      const isDC = /\b(dc comics|dc \/ vertigo|gotham|watchmen)\b/.test(fullCorpus);
      return isDC ? { verdict: "YES", answerText: "Aye! They belong to the DC Comics pantheon." } : { verdict: "NO", answerText: "Nay! They are not from DC Comics." };
    }
    return isComic ? { verdict: "YES", answerText: "Aye! They are a comic book or superhero figure." } : { verdict: "NO", answerText: "Nay! They are not from comic books or superhero lore." };
  }
  if (/\b(tv|television|series|show|sitcom)\b/.test(q)) {
    const isTV = /\b(tv|simpsons|office|breaking bad|scooby|stranger things|game of thrones|friends|family guy|futurama|doctor who|star trek|avatar|bob's burgers|daria|dexter|family matters|jimmy neutron|arthur|monk|columbo|veronica mars|heroes|saved by the bell|malcolm|fleabag|gargoyles|muppets|sesame street|food network|nickelodeon|bbc|mtv|pbs)\b/.test(fullCorpus);
    return isTV ? { verdict: "YES", answerText: "Aye! They are famous from television." } : { verdict: "NO", answerText: "Nay! They are not primarily a television character." };
  }
  if (/\b(movie|movies|film|cinema)\b/.test(q)) {
    const isMovie = !isReal && /\b(star wars|harry potter|lord of the rings|hobbit|matrix|indiana jones|back to the future|toy story|incredibles|monsters, inc|finding nemo|ratatouille|inside out|lion king|aladdin|sleeping beauty|emperor's new groove|lilo|shrek|megamind|despicable me|how to train|ghostbusters|austin powers|nightmare on elm street|scream|friday the 13th|pirates of the caribbean|fast & furious|mad max|terminator|bill & ted|knives out|pink panther|ace ventura|scarface|princess bride|wizard of oz|ferris bueller|the mask|hunger games|karate kid|alien|james bond|007|marvel|dc comics)\b/.test(fullCorpus);
    return isMovie ? { verdict: "YES", answerText: "Aye! They have starred on the silver screen in film." } : { verdict: "NO", answerText: "Nay! They are not primarily known as a movie character." };
  }
  if (/\b(book|novel|literature|myth|mythology|folklore|legend|fairy tale)\b/.test(q)) {
    const isLit = /\b(harry potter|lord of the rings|hobbit|doyle|sherlock|agatha christie|roald dahl|seuss|michael bond|mcculley|alice in wonderland|folklore|robin hood|gaston leroux|barrie|peter pan|carolyn keene|arthurian|merlin|king arthur|pinocchio|riordan|witcher|herge|wizard of oz|washington irving|hunger games|bram stoker|mythology|greek|norse|egyptian)\b/.test(fullCorpus);
    return isLit ? { verdict: "YES", answerText: "Aye! Their tale is rooted in literature, books, or mythic folklore." } : { verdict: "NO", answerText: "Nay! They did not originate primarily from classic books or mythology." };
  }
  if (/\b(villain|antagonist|bad guy|evil|dark lord|criminal|enemy|terrorist|slasher)\b/.test(q)) {
    return isVillain ? { verdict: "YES", answerText: "Aye! They are known as a villain, antagonist, or outlaw." } : { verdict: "NO", answerText: "Nay! They are not a villain." };
  }
  if (/\b(hero|protagonist|good guy|main character|savior|champion)\b/.test(q)) {
    return !isVillain ? { verdict: "YES", answerText: "Aye! They stand as a protagonist, hero, or leading figure." } : { verdict: "NO", answerText: "Nay! They walk the darker path of a villain or antagonist." };
  }
  if (/\b(royal|royalty|king|queen|prince|princess|monarch|emperor|throne|crown|ruler|lord)\b/.test(q)) {
    const isRoyal = charCategories.includes("exiled-royalty") || charCategories.includes("legendary-rulers") || /\b(king|queen|prince|princess|emperor|pharaoh|royal|throne|monarch|lord of winterfell|ruler)\b/.test(fullCorpus);
    return isRoyal ? { verdict: "YES", answerText: "Aye! Royal blood, a crown, or high rule belongs to their story." } : { verdict: "NO", answerText: "Nay! They are not royalty or a crowned monarch." };
  }
  if (/\b(detective|sleuth|investigator|mystery|mysteries|crime|police|cop|sheriff|agent)\b/.test(q)) {
    const isSleuth = charCategories.includes("sleuths-and-detectives") || charCategories.includes("master-sleuths") || /\b(detective|sleuth|investigator|mystery|police|homicide|sheriff|agent|fbi|shield)\b/.test(fullCorpus);
    return isSleuth ? { verdict: "YES", answerText: "Aye! They are known for investigating mysteries, crimes, or enforcing the law." } : { verdict: "NO", answerText: "Nay! They are not a detective or investigator." };
  }
  if (/\b(father|dad|parent|children|kids|son|daughter|family)\b/.test(q)) {
    const isParent = charCategories.includes("fathers") || /\b(father|dad|son|daughter|children|patriarch)\b/.test(fullCorpus);
    return isParent ? { verdict: "YES", answerText: "Aye! They are a parent or father figure." } : { verdict: "NO", answerText: "Nay! Being a parent is not a defining trait of their story." };
  }
  if (/\b(kid|child|teen|teenager|young|student|school|boy|girl)\b/.test(q)) {
    return isYoung ? { verdict: "YES", answerText: "Aye! They are depicted as a child, teenager, or young student." } : { verdict: "NO", answerText: "Nay! Your character is a grown adult (or ancient being)." };
  }
  if (/\b(mentor|teacher|professor|master|old|elderly|wise)\b/.test(q)) {
    const isMentor = charCategories.includes("legendary-mentors") || /\b(mentor|teacher|professor|headmaster|master|grand master|elderly|ancient|sensei)\b/.test(fullCorpus);
    return isMentor ? { verdict: "YES", answerText: "Aye! They are known as a mentor, teacher, or wise elder." } : { verdict: "NO", answerText: "Nay! They are not primarily a wise elder or mentor." };
  }
  if (/\b(chef|cook|food|baker|kitchen|culinary|restaurant|eat)\b/.test(q)) {
    const isFood = charCategories.includes("food-culinary") || charCategories.includes("famous-cooks") || /\b(chef|cook|baker|culinary|food|kitchen|krabby|lasagna|cookie|donut|spinach|marmalade)\b/.test(fullCorpus);
    return isFood ? { verdict: "YES", answerText: "Aye! Cooking, cuisine, or a famous appetite defines them." } : { verdict: "NO", answerText: "Nay! They are not a chef or culinary figure." };
  }
  if (/\b(doctor|physician|nurse|surgeon|scientist|inventor|genius|chemist)\b/.test(q)) {
    const isSciDoc = charCategories.includes("iconic-healers") || /\b(doctor|dr\.|surgeon|nurse|physician|scientist|inventor|genius|chemist|professor|science)\b/.test(fullCorpus);
    return isSciDoc ? { verdict: "YES", answerText: "Aye! They are a doctor, healer, scientist, or brilliant inventor." } : { verdict: "NO", answerText: "Nay! They are neither a doctor nor a scientist." };
  }
  if (/\b(magic|magical|wizard|witch|sorcerer|spell|powers|superpower|superhuman|force|telepath|mutant)\b/.test(q)) {
    const hasMagicOrPower = charCategories.includes("magic-wizards-witches") || charCategories.includes("superhuman-durability") || /\b(magic|wizard|witch|sorcerer|spell|superpower|superhuman|mutant|telepath|force|jedi|sith|avatar|airbender|saiyan|god|demigod|goddess|enchanted|curse|speedster|time lord|chronokinesis|gamma|krypton|spider|lasso)\b/.test(fullCorpus);
    return hasMagicOrPower ? { verdict: "YES", answerText: "Aye! They wield magic, the Force, or superhuman powers." } : { verdict: "NO", answerText: "Nay! They rely on mortal skill, wit, or technology rather than magic or superpowers." };
  }
  if (/\b(glasses|spectacles|goggles|visor|eyewear|sunglasses)\b/.test(q)) {
    const wearsGlasses = charCategories.includes("glasses-spectacles-goggles") || /\b(glasses|spectacles|goggles|visor|sunglasses|eyewear)\b/.test(fullCorpus);
    return wearsGlasses ? { verdict: "YES", answerText: "Aye! They wear signature glasses, spectacles, goggles, or a visor." } : { verdict: "NO", answerText: "Nay! They do not wear signature glasses." };
  }
  if (/\b(hat|fedora|cap|top hat|cowboy hat|headwear|helmet|crown)\b/.test(q) && !/\bmask\b/.test(q)) {
    const wearsHat = charCategories.includes("iconic-hats") || charCategories.includes("masks-helmets-disguises") || /\b(hat|fedora|cap|top hat|deerstalker|helmet|tricorn|bycocket|phrygian|crown)\b/.test(fullCorpus);
    return wearsHat ? { verdict: "YES", answerText: "Aye! They wear an iconic hat, cap, helmet, or crown." } : { verdict: "NO", answerText: "Nay! They are not known for wearing a signature hat." };
  }
  if (/\b(mask|helmet|disguise|cowl|hide their face|conceal)\b/.test(q)) {
    const wearsMask = charCategories.includes("masks-helmets-disguises") || charCategories.includes("caped-masked") || /\b(mask|helmet|cowl|disguise)\b/.test(fullCorpus);
    return wearsMask ? { verdict: "YES", answerText: "Aye! They conceal their face behind a mask, cowl, or helmet." } : { verdict: "NO", answerText: "Nay! Their face is not hidden behind a mask or helmet." };
  }
  if (/\b(bald|hairless|no hair|shaved head)\b/.test(q)) {
    const isBald = charCategories.includes("bald-hairless") || /\b(bald|hairless|shaves his head|shaven)\b/.test(fullCorpus);
    return isBald ? { verdict: "YES", answerText: "Aye! They are bald or lack head hair." } : { verdict: "NO", answerText: "Nay! They have hair (or fur/headgear)." };
  }
  if (/\b(scar|eyepatch|eye patch|facial mark|burn|tattoo)\b/.test(q)) {
    const hasScar = charCategories.includes("scars-eyepatches") || /\b(scar|eyepatch|eye patch|burn mark|tattoo)\b/.test(fullCorpus);
    return hasScar ? { verdict: "YES", answerText: "Aye! They bear an iconic scar, eyepatch, or facial marking." } : { verdict: "NO", answerText: "Nay! They are not defined by a facial scar or eyepatch." };
  }
  if (/\b(weapon|sword|blade|hammer|lightsaber|gun|shield|lasso|wand|bow|machete)\b/.test(q)) {
    const hasWeapon = charCategories.includes("legendary-weapons") || /\b(weapon|sword|blade|hammer|mjolnir|excalibur|lightsaber|dagger|sting|buster sword|wand|machete|gun|gatling|shield|lasso|trident|saber)\b/.test(fullCorpus);
    return hasWeapon ? { verdict: "YES", answerText: "Aye! They wield a signature weapon, blade, wand, or armament." } : { verdict: "NO", answerText: "Nay! They do not carry a signature weapon." };
  }
  if (/\b(space|galaxy|star wars|star trek|sci-fi|science fiction|future|time travel|time)\b/.test(q)) {
    if (/\bstar wars\b/.test(q)) {
      return originLower.includes("star wars") ? { verdict: "YES", answerText: "Aye! They hail from a galaxy far, far away (Star Wars)." } : { verdict: "NO", answerText: "Nay! They are not from Star Wars." };
    }
    if (/\b(time travel|travel through time|time machine)\b/.test(q)) {
      const isTime = charCategories.includes("time-travelers") || /\b(time travel|time machine|tardis|delorean|time-turner|flux capacitor)\b/.test(fullCorpus);
      return isTime ? { verdict: "YES", answerText: "Aye! They travel through or manipulate time." } : { verdict: "NO", answerText: "Nay! Time travel is not their domain." };
    }
    const isSciFi = charCategories.includes("cosmic-explorers") || charCategories.includes("time-travelers") || charCategories.includes("cybernetic-robotic-limbs") || /\b(star wars|star trek|futurama|matrix|back to the future|doctor who|terminator|halo|alien|space|galaxy|sci-fi|cybernetic|lilo|megamind|rick|guardians)\b/.test(fullCorpus);
    return isSciFi ? { verdict: "YES", answerText: "Aye! Their story involves sci-fi, outer space, or futuristic technology." } : { verdict: "NO", answerText: "Nay! They are not from a sci-fi or outer-space setting." };
  }
  if (/\b(fantasy|medieval|dragon|elf|hobbit|magic|hogwarts|middle-earth|westeros)\b/.test(q)) {
    const isFantasy = charCategories.includes("magic-wizards-witches") || /\b(harry potter|lord of the rings|hobbit|game of thrones|witcher|zelda|arthurian|sleeping beauty|aladdin|lion king|shrek|peter pan|wizard of oz|avatar|how to train|inuyasha|fullmetal|norse|greek|mythology|fantasy)\b/.test(fullCorpus);
    return isFantasy ? { verdict: "YES", answerText: "Aye! They belong to a fantasy, magical, or mythic realm." } : { verdict: "NO", answerText: "Nay! They are not from a medieval or fantasy realm." };
  }
  if (/\b(green)\b/.test(q)) {
    const isGreen = charCategories.includes("green-design") || /\bgreen\b/.test(fullCorpus);
    return isGreen ? { verdict: "YES", answerText: "Aye! Green is their signature color." } : { verdict: "NO", answerText: "Nay! They are not predominantly green." };
  }
  if (/\b(blue)\b/.test(q)) {
    const isBlue = charCategories.includes("blue-design") || /\bblue\b/.test(fullCorpus);
    return isBlue ? { verdict: "YES", answerText: "Aye! Blue is strongly tied to their look." } : { verdict: "NO", answerText: "Nay! They are not predominantly blue." };
  }
  const stopWords = /* @__PURE__ */ new Set([
    "does",
    "have",
    "they",
    "their",
    "character",
    "from",
    "with",
    "that",
    "this",
    "were",
    "what",
    "when",
    "where",
    "which",
    "about",
    "known",
    "famous",
    "wear",
    "wears",
    "into",
    "like",
    "some",
    "more",
    "very",
    "only",
    "ever",
    "been",
    "make",
    "made",
    "good",
    "main",
    "part"
  ]);
  const queryWords = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4 && !stopWords.has(w));
  if (queryWords.length > 0) {
    const matchedKeyword = queryWords.find((w) => fullCorpus.includes(w));
    if (matchedKeyword) {
      return {
        verdict: "YES",
        answerText: "Aye! The royal chronicles confirm that connection to your character."
      };
    }
  }
  return {
    verdict: "NO",
    answerText: "Nay! That does not describe your secret identity according to the royal archives."
  };
}

// public/assets/aistudio/Commonalities_6c05b138.json
var Commonalities_6c05b138_default = [
  { id: 1, trait: "Both characters have artificial, robotic, or cybernetic limbs." },
  { id: 2, trait: "Both characters are known for an iconic scar, eyepatch, or facial marking." },
  { id: 3, trait: "Both characters possess superhuman durability or regenerative healing." },
  { id: 4, trait: "Both characters conceal their true face behind a mask, helmet, or heavy disguise." },
  { id: 5, trait: "Both characters share a distinct, non-human hair or skin color (e.g., silver hair, green skin)." },
  { id: 6, trait: "Both characters underwent an experimental procedure or ritual that permanently altered their biology." },
  { id: 7, trait: "Both characters wear an iconic longcoat, cape, or cloak that defines their silhouette." },
  { id: 8, trait: "Both characters possess unnatural, glowing, or mismatched eyes (heterochromia)." },
  { id: 9, trait: "Both characters are physically non-humanoid or constantly shift forms." },
  { id: 10, trait: "Both characters are notably diminutive or towering compared to everyone around them." },
  { id: 11, trait: "Both characters have prominent horns, wings, or animal appendages." },
  { id: 12, trait: "Both characters are fathers." },
  { id: 13, trait: "Both characters have a spouse or a canonical romantic partner." },
  { id: 14, trait: "Both characters are accompanied by a loyal pet or animal familiar." },
  { id: 15, trait: "Both characters are motivated by avenging a lost family member." },
  { id: 16, trait: "Both characters mentor an impulsive or rebellious younger prot\xE9g\xE9." },
  { id: 17, trait: "Both characters are the last surviving member of their clan, race, or order." },
  { id: 18, trait: "Both characters are royalty who were exiled or willingly renounced their throne." },
  { id: 19, trait: "Both characters use an alias because their real name is widely feared or hunted." },
  { id: 20, trait: "Both characters share an intense 'frenemy' rivalry with a former childhood friend." },
  { id: 21, trait: "Both characters were raised by an adoptive parent who was originally their enemy." },
  { id: 22, trait: "Both characters have an estranged twin or evil sibling." },
  { id: 23, trait: "Both characters lead an elite military unit or outlaw mercenary guild." },
  { id: 24, trait: "Both characters wield a legendary, named weapon (e.g., a specific sword, hammer, or staff)." },
  { id: 25, trait: "Both characters rely on a sentient or talking companion item (like an AI assistant or cursed blade)." },
  { id: 26, trait: "Both characters draw power from a dark or forbidden source they struggle to control." },
  { id: 27, trait: "Both characters can manipulate a specific element (e.g., lightning, shadow, ice, blood)." },
  { id: 28, trait: "Both characters travel in an iconic, modified vehicle, mount, or starship." },
  { id: 29, trait: "Both characters possess the ability to travel through time or manipulate the flow of time." },
  { id: 30, trait: "Both characters can teleport or phase through solid objects." },
  { id: 31, trait: "Both characters fight using telekinesis or invisible mental constructs." },
  { id: 32, trait: "Both characters channel magic or energy through specialized musical instruments or melodies." },
  { id: 33, trait: "Both characters are master gunslingers or archers known for impossible trick shots." },
  { id: 34, trait: "Both characters use cards, dice, or games of chance to activate their powers." },
  { id: 35, trait: "Both characters are morally grey antiheroes." },
  { id: 36, trait: "Both characters were originally introduced as villains before undergoing redemption." },
  { id: 37, trait: "Both characters made a tragic, fatal contract to protect someone they loved." },
  { id: 38, trait: "Both characters were sealed away, frozen, or trapped in stasis for centuries before awakening." },
  { id: 39, trait: "Both characters operate outside the law while following a strict personal code of honor." },
  { id: 40, trait: "Both characters died and were resurrected through supernatural or scientific means." },
  { id: 41, trait: "Both characters were betrayed by the mentor or institution they trusted most." },
  { id: 42, trait: "Both characters are doomed by a prophetic curse they actively try to avert." },
  { id: 43, trait: "Both characters sacrificed their humanity or sanity in pursuit of knowledge or victory." },
  { id: 44, trait: "Both characters are amnesiacs reconstructing their dark past." },
  { id: 45, trait: "Both characters carry the guilt of inadvertently destroying their own home world or city." },
  { id: 46, trait: "Both characters serve as commercial or food brand mascots." },
  { id: 47, trait: "Both characters have an obsessive love for a specific food or drink (e.g., ramen, chimichangas, coffee)." },
  { id: 48, trait: "Both characters regularly break the fourth wall and acknowledge the audience." },
  { id: 49, trait: "Both characters debuted in the 1980s or 1990s." },
  { id: 50, trait: "Both characters have appeared as playable guest fighters in major crossover games." },
  { id: 51, trait: "Both characters share the same voice actor across notable dubs or adaptations." },
  { id: 52, trait: "Both characters work as cynical private investigators, detectives, or bounty hunters." },
  { id: 53, trait: "Both characters are eccentric, mad scientists responsible for their own problems." },
  { id: 54, trait: "Both characters run an underground tavern, antique shop, or black-market bar." },
  { id: 55, trait: "Both characters are known for a famous catchphrase they repeat before finishing a battle." },
  { id: 56, trait: "Both characters have no arms or legs (floating hands/feet or limbless)." },
  { id: 57, trait: "Both characters wear white cartoon or butler-style gloves." },
  { id: 58, trait: "Both characters are predominantly green in character design or wardrobe." },
  { id: 59, trait: "Both characters are predominantly blue in character design or wardrobe." },
  { id: 60, trait: "Both characters are predominantly purple or pink in character design or wardrobe." },
  { id: 61, trait: "Both characters are prehistoric beings (dinosaurs, cavemen, or ancient fossils)." },
  { id: 62, trait: "Both characters are aquatic or spend their entire lives underwater." },
  { id: 63, trait: "Both characters are available as skins or crossovers in Fortnite." },
  { id: 64, trait: 'Both characters share the first name "John" (or a variation like Jon/Jonathan).' },
  { id: 65, trait: 'Both characters share the first name "Jimmy" (or James/Jim).' },
  { id: 66, trait: 'Both characters share the first name "Jack" (or Jackson/Jackie).' },
  { id: 67, trait: "Both characters are core members of a four-person squad or quartet." },
  { id: 68, trait: "Both characters are purely irredeemable, cartoonishly evil main villains." },
  { id: 69, trait: "Both characters appear in the SpongeBob SquarePants animated universe." },
  { id: 70, trait: "Both characters are sentient food items or anthropomorphic dishes." },
  { id: 71, trait: "Both characters are completely bald or lack any head hair by design." },
  { id: 72, trait: "Both characters wear prominent, oversized glasses, spectacles, or goggles." },
  { id: 73, trait: "Both characters wear an iconic hat (fedora, top hat, cowboy hat, or wizard hat) that rarely comes off." },
  { id: 74, trait: "Both characters speak in third person or cannot speak in coherent human sentences." },
  { id: 75, trait: "Both characters possess a demonic inner entity or second personality sharing their body." },
  { id: 76, trait: "Both characters fight exclusively with hand-to-hand martial arts rather than weapons or magic." },
  { id: 77, trait: "Both characters are professional chefs, bakers, or culinary perfectionists." },
  { id: 78, trait: "Both characters are ghosts, spirits, or undead apparitions." },
  { id: 79, trait: "Both characters are pilots who control a giant mecha, robot, or titan." },
  { id: 80, trait: "Both characters are animated skeletons or animated suits of armor." },
  { id: 81, trait: "Both characters have detachable body parts that they use in combat or comedy." },
  { id: 82, trait: "Both characters are royalty who rule over an underground or underworld kingdom." },
  { id: 83, trait: "Both characters have a severe, comedic phobia of something innocuous (e.g., water, cats, germs)." },
  { id: 84, trait: "Both characters are androids or gynoids who developed genuine human emotions." },
  { id: 85, trait: "Both characters are bounty hunters who capture their targets strictly for monetary gain." },
  { id: 86, trait: "Both characters are shapeshifting mimics or doppelg\xE4ngers." },
  { id: 87, trait: "Both characters wield twin blades or dual-wield pistols." },
  { id: 88, trait: "Both characters are tied to an iconic musical instrument they carry into dangerous situations." },
  { id: 89, trait: "Both characters are vampires, dhampirs, or blood-drinking supernatural entities." },
  { id: 90, trait: "Both characters are alien refugees living undercover on contemporary Earth." },
  { id: 91, trait: "Both characters are voiced by the same legendary celebrity guest actor (e.g., Keith David, Mark Hamill, Jack Black)." },
  { id: 92, trait: "Both characters originate from video games released during the fifth console generation (PS1 / N64 / Saturn)." },
  { id: 93, trait: "Both characters use heavy explosives, bombs, or dynamite as their primary offensive tool." },
  { id: 94, trait: "Both characters are gods, deities, or demigods stripped of their cosmic divinity." },
  { id: 95, trait: "Both characters are anthropomorphic animals who walk on two legs and hold white-collar jobs." },
  { id: 96, trait: "Both characters have a sentient shadow that acts independently of their body." },
  { id: 97, trait: "Both characters are known for drinking tea, coffee, or a signature brew during tense conversations." },
  { id: 98, trait: "Both characters were created in a laboratory vat as a cloned weapon." },
  { id: 99, trait: "Both characters belong to a secret order of silent monks, assassins, or templars." },
  { id: 100, trait: "Both characters fight while blindfolded or are completely blind with heightened other senses." },
  { id: 101, trait: "Both characters have their powers directly amplified or restricted by moonlight or sunlight." },
  { id: 102, trait: "Both characters possess a mechanical pocket watch, compass, or trinket from their deceased partner." },
  { id: 103, trait: "Both characters are infamous sky pirates or captain an airship." },
  { id: 104, trait: "Both characters are known for wearing an unbuttoned suit, trench coat, or loosened tie." },
  { id: 105, trait: "Both characters have an iconic theme song or leitmotif featuring heavy brass or pipe organ." },
  { id: 106, trait: "Both characters can grow to gargantuan, skyscraper-level proportions when enraged." },
  { id: 107, trait: "Both characters are comic relief sidekicks who accidentally resolve the main conflict." },
  { id: 108, trait: "Both characters were turned into an animal by a witch or sorcerer's curse." },
  { id: 109, trait: "Both characters are heavily associated with an iconic umbrella or parasol used as a weapon." },
  { id: 110, trait: "Both characters communicate strictly through telepathy or text projections." },
  { id: 111, trait: "Both characters are time-loop prisoners forced to repeat a single catastrophic day." },
  { id: 112, trait: "Both characters run an orphanage, school, or academy for gifted or dangerous youths." },
  { id: 113, trait: "Both characters have a price on their head exceeding one billion credits or currency units." },
  { id: 114, trait: "Both characters possess golden or gilded armor that signifies their legendary rank." },
  { id: 115, trait: "Both characters ride an oversized mythical beast or chimeric creature rather than walking." },
  { id: 116, trait: "Both characters are addicted to gambling and regularly wager their soul or freedom." },
  { id: 117, trait: "Both characters have a mechanical voice or rely on a voice synthesizer to speak." },
  { id: 118, trait: "Both characters were raised by wild beasts or monsters in the wilderness." },
  { id: 119, trait: "Both characters carry a cursed book, grimoire, or tome strapped to their waist." },
  { id: 120, trait: "Both characters fight using thread, wires, or invisible strings." },
  { id: 121, trait: "Both characters were originally statues, toys, or wooden figures brought to life by magic." },
  { id: 122, trait: "Both characters wield heavy shields as their primary offensive weapon." },
  { id: 123, trait: "Both characters can manipulate gravity or walk freely along walls and ceilings." },
  { id: 124, trait: "Both characters carry the soul of their deceased sibling inside an amulet or weapon." },
  { id: 125, trait: "Both characters are professional thieves who leave a calling card before every heist." },
  { id: 126, trait: "Both characters are trapped inside a digital simulation, virtual reality game, or cyberspace." },
  { id: 127, trait: "Both characters fight primarily by summoning familiars, monsters, or astral avatars." },
  { id: 128, trait: "Both characters have visible mechanical gears, steam vents, or clockwork components in their bodies." },
  { id: 129, trait: "Both characters are bounty hunters pursuing the specific protagonist of their series." },
  { id: 130, trait: "Both characters wear heavy bandaging across their torso, arms, or head to conceal severe injuries." },
  { id: 131, trait: "Both characters have a signature laugh that signals their entrance into a scene." },
  { id: 132, trait: "Both characters rely on potions, vials, or chemical serums to trigger temporary transformations." },
  { id: 133, trait: "Both characters are guardians of an ancient gate, portal, or bridge that prevents interdimensional invasion." },
  { id: 134, trait: "Both characters are former world-champion fighters who retired after an accidental fatality." },
  { id: 135, trait: "Both characters fight utilizing sharp claws integrated directly into their combat gloves or gauntlets." },
  { id: 136, trait: "Both characters have an obsessive collector habit (e.g., collecting rare coins, cursed relics, teeth)." },
  { id: 137, trait: "Both characters are sentient celestial bodies, stars, or personifications of planets." },
  { id: 138, trait: "Both characters serve as the comic-relief muscle in a villainous three-person syndicate." },
  { id: 139, trait: "Both characters wield a scythe or giant farming implement in direct combat." },
  { id: 140, trait: "Both characters draw power directly from the fear, despair, or negative emotions of others." },
  { id: 141, trait: "Both characters wear headphones, earmuffs, or auditory dampers as part of their character design." },
  { id: 142, trait: "Both characters are pilots of submarines or seafaring ironclad vessels." },
  { id: 143, trait: "Both characters possess a tail that functions as a prehensile third arm or concealed blade." },
  { id: 144, trait: "Both characters were frozen in a block of ice before being thawed in modern times." },
  { id: 145, trait: "Both characters are sentient plants, fungi, or botanical elemental humanoids." },
  { id: 146, trait: "Both characters speak entirely in rhymes, riddles, or poetic couplets." },
  { id: 147, trait: "Both characters are bound by a geas or magic oath that causes physical pain if broken." },
  { id: 148, trait: "Both characters are known for carrying an unusually large backpack, trunk, or luggage bag on their travels." },
  { id: 149, trait: "Both characters are mercenaries who switched sides halfway through the final battle for a higher payout." },
  { id: 150, trait: "Both characters have a mechanical eye that functions as a scanner, targeting reticle, or camera." },
  { id: 151, trait: "Both characters originate from an alternate timeline where their heroic faction lost the war." },
  { id: 152, trait: "Both characters are renowned blacksmiths, armorers, or artificers who forged the setting's relic gear." },
  { id: 153, trait: "Both characters have a signature deck of tarot cards used to predict major plot deaths." },
  { id: 154, trait: "Both characters are space bounty hunters who fly solo ships across distant galaxies." },
  { id: 155, trait: "Both characters possess an aura or energy field that immediately wilts nearby plant life." },
  { id: 156, trait: "Both characters are martial artists who fight while completely intoxicated or asleep." },
  { id: 157, trait: "Both characters wear roller skates, hover shoes, or motorized footwear in combat." },
  { id: 158, trait: "Both characters are trapped in a pact with an infernal demon lord or cosmic entity." },
  { id: 159, trait: "Both characters are legendary snipers who can hit targets over multiple miles away." },
  { id: 160, trait: "Both characters carry a cursed lantern or torch that reveals invisible spirits and hidden doors." },
  { id: 161, trait: "Both characters are known for consuming inedible matter (e.g., metal, rocks, glass) with zero ill effects." },
  { id: 162, trait: "Both characters operate a mysterious train, ferry, or transport that carries souls to the afterlife." },
  { id: 163, trait: "Both characters are politicians." },
  { id: 164, trait: "Both characters have full time jobs." },
  { id: 165, trait: "Both characters are motivated by protecting a specific city, domain, or home." },
  { id: 166, trait: "Both characters belong to a larger organization, faction, or guild." },
  { id: 167, trait: "Both characters are known for a specific, signature outfit or color palette." },
  { id: 168, trait: "Both characters have experienced a major betrayal in their past." },
  { id: 169, trait: "Both characters possess a secret identity or double life." },
  { id: 170, trait: "Both characters fight using long-range or ranged weapons rather than close combat." },
  { id: 171, trait: "Both characters are defined by a strong personal moral code or strict philosophy." },
  { id: 172, trait: "Both characters originate from a world or setting governed by magic or supernatural rules." },
  { id: 173, trait: "Both characters have a key relationship with a mentor or parental figure who shaped their journey." },
  { id: 174, trait: "Both characters carry a tragic flaw or weakness that regularly hinders them." }
];

// public/assets/aistudio/TopCharacters_b19eb45c.json
var TopCharacters_b19eb45c_default = [
  { id: 1, name: "Darth Vader", origin: "Star Wars" },
  { id: 2, name: "Luke Skywalker", origin: "Star Wars" },
  { id: 3, name: "Han Solo", origin: "Star Wars" },
  { id: 4, name: "Princess Leia", origin: "Star Wars" },
  { id: 5, name: "Yoda", origin: "Star Wars" },
  { id: 6, name: "Obi-Wan Kenobi", origin: "Star Wars" },
  { id: 7, name: "Boba Fett", origin: "Star Wars" },
  { id: 8, name: "Chewbacca", origin: "Star Wars" },
  { id: 9, name: "R2-D2", origin: "Star Wars" },
  { id: 10, name: "C-3PO", origin: "Star Wars" },
  { id: 11, name: "Darth Maul", origin: "Star Wars" },
  { id: 12, name: "Emperor Palpatine", origin: "Star Wars" },
  { id: 13, name: "Din Djarin (The Mandalorian)", origin: "Star Wars" },
  { id: 14, name: "Grogu (Baby Yoda)", origin: "Star Wars" },
  { id: 15, name: "Ahsoka Tano", origin: "Star Wars" },
  { id: 16, name: "Kylo Ren", origin: "Star Wars" },
  { id: 17, name: "Indiana Jones", origin: "Indiana Jones" },
  { id: 18, name: "James Bond", origin: "007" },
  { id: 19, name: "Ernst Stavro Blofeld", origin: "007" },
  { id: 20, name: "Oddjob", origin: "007" },
  { id: 21, name: "Jaws (Richard Kiel)", origin: "007" },
  { id: 22, name: "Sherlock Holmes", origin: "Sherlock Holmes" },
  { id: 23, name: "Dr. John Watson", origin: "Sherlock Holmes" },
  { id: 24, name: "Professor James Moriarty", origin: "Sherlock Holmes" },
  { id: 25, name: "Harry Potter", origin: "Harry Potter" },
  { id: 26, name: "Hermione Granger", origin: "Harry Potter" },
  { id: 27, name: "Ron Weasley", origin: "Harry Potter" },
  { id: 28, name: "Albus Dumbledore", origin: "Harry Potter" },
  { id: 29, name: "Severus Snape", origin: "Harry Potter" },
  { id: 30, name: "Lord Voldemort", origin: "Harry Potter" },
  { id: 31, name: "Rubeus Hagrid", origin: "Harry Potter" },
  { id: 32, name: "Draco Malfoy", origin: "Harry Potter" },
  { id: 33, name: "Dobby", origin: "Harry Potter" },
  { id: 34, name: "Sirius Black", origin: "Harry Potter" },
  { id: 35, name: "Bellatrix Lestrange", origin: "Harry Potter" },
  { id: 36, name: "Frodo Baggins", origin: "The Lord of the Rings" },
  { id: 37, name: "Gandalf", origin: "The Lord of the Rings" },
  { id: 38, name: "Aragorn", origin: "The Lord of the Rings" },
  { id: 39, name: "Legolas", origin: "The Lord of the Rings" },
  { id: 40, name: "Gimli", origin: "The Lord of the Rings" },
  { id: 41, name: "Gollum (Sm\xE9agol)", origin: "The Lord of the Rings" },
  { id: 42, name: "Samwise Gamgee", origin: "The Lord of the Rings" },
  { id: 43, name: "Sauron", origin: "The Lord of the Rings" },
  { id: 44, name: "Saruman", origin: "The Lord of the Rings" },
  { id: 45, name: "Bilbo Baggins", origin: "The Hobbit" },
  { id: 46, name: "Spider-Man (Peter Parker)", origin: "Marvel" },
  { id: 47, name: "Miles Morales", origin: "Marvel" },
  { id: 48, name: "Iron Man (Tony Stark)", origin: "Marvel" },
  { id: 49, name: "Captain America (Steve Rogers)", origin: "Marvel" },
  { id: 50, name: "Thor", origin: "Marvel" },
  { id: 51, name: "Hulk (Bruce Banner)", origin: "Marvel" },
  { id: 52, name: "Black Widow (Natasha Romanoff)", origin: "Marvel" },
  { id: 53, name: "Hawkeye (Clint Barton)", origin: "Marvel" },
  { id: 54, name: "Wolverine (Logan)", origin: "Marvel" },
  { id: 55, name: "Deadpool (Wade Wilson)", origin: "Marvel" },
  { id: 56, name: "Thanos", origin: "Marvel" },
  { id: 57, name: "Loki", origin: "Marvel" },
  { id: 58, name: "Magneto", origin: "Marvel" },
  { id: 59, name: "Professor X (Charles Xavier)", origin: "Marvel" },
  { id: 60, name: "Cyclops (Scott Summers)", origin: "Marvel" },
  { id: 61, name: "Storm (Ororo Munroe)", origin: "Marvel" },
  { id: 62, name: "Jean Grey", origin: "Marvel" },
  { id: 63, name: "Rogue", origin: "Marvel" },
  { id: 64, name: "Gambit", origin: "Marvel" },
  { id: 65, name: "Nightcrawler", origin: "Marvel" },
  { id: 66, name: "Venom (Eddie Brock)", origin: "Marvel" },
  { id: 67, name: "Green Goblin (Norman Osborn)", origin: "Marvel" },
  { id: 68, name: "Doctor Octopus (Otto Octavius)", origin: "Marvel" },
  { id: 69, name: "Doctor Doom (Victor Von Doom)", origin: "Marvel" },
  { id: 70, name: "Black Panther (T'Challa)", origin: "Marvel" },
  { id: 71, name: "Doctor Strange (Stephen Strange)", origin: "Marvel" },
  { id: 72, name: "Scarlet Witch (Wanda Maximoff)", origin: "Marvel" },
  { id: 73, name: "Vision", origin: "Marvel" },
  { id: 74, name: "Star-Lord (Peter Quill)", origin: "Marvel" },
  { id: 75, name: "Groot", origin: "Marvel" },
  { id: 76, name: "Rocket Raccoon", origin: "Marvel" },
  { id: 77, name: "Daredevil (Matt Murdock)", origin: "Marvel" },
  { id: 78, name: "The Punisher (Frank Castle)", origin: "Marvel" },
  { id: 79, name: "Blade", origin: "Marvel" },
  { id: 80, name: "Ghost Rider (Johnny Blaze)", origin: "Marvel" },
  { id: 81, name: "Silver Surfer", origin: "Marvel" },
  { id: 82, name: "Galactus", origin: "Marvel" },
  { id: 83, name: "Nick Fury", origin: "Marvel" },
  { id: 84, name: "Winter Soldier (Bucky Barnes)", origin: "Marvel" },
  { id: 85, name: "Kingpin (Wilson Fisk)", origin: "Marvel" },
  { id: 86, name: "Batman (Bruce Wayne)", origin: "DC" },
  { id: 87, name: "Superman (Clark Kent)", origin: "DC" },
  { id: 88, name: "Wonder Woman (Diana Prince)", origin: "DC" },
  { id: 89, name: "The Joker", origin: "DC" },
  { id: 90, name: "Harley Quinn", origin: "DC" },
  { id: 91, name: "Catwoman (Selina Kyle)", origin: "DC" },
  { id: 92, name: "Robin (Dick Grayson)", origin: "DC" },
  { id: 93, name: "The Flash (Barry Allen)", origin: "DC" },
  { id: 94, name: "Aquaman (Arthur Curry)", origin: "DC" },
  { id: 95, name: "Green Lantern (Hal Jordan)", origin: "DC" },
  { id: 96, name: "Cyborg (Victor Stone)", origin: "DC" },
  { id: 97, name: "Lex Luthor", origin: "DC" },
  { id: 98, name: "Bane", origin: "DC" },
  { id: 99, name: "Two-Face (Harvey Dent)", origin: "DC" },
  { id: 100, name: "The Riddler (Edward Nygma)", origin: "DC" },
  { id: 101, name: "The Penguin (Oswald Cobblepot)", origin: "DC" },
  { id: 102, name: "Poison Ivy", origin: "DC" },
  { id: 103, name: "Mr. Freeze", origin: "DC" },
  { id: 104, name: "Scarecrow (Jonathan Crane)", origin: "DC" },
  { id: 105, name: "Darkseid", origin: "DC" },
  { id: 106, name: "Deathstroke (Slade Wilson)", origin: "DC" },
  { id: 107, name: "Peacemaker", origin: "DC" },
  { id: 108, name: "John Constantine", origin: "DC" },
  { id: 109, name: "Rorschach", origin: "Watchmen" },
  { id: 110, name: "Doctor Manhattan", origin: "Watchmen" },
  { id: 111, name: "Homelander", origin: "The Boys" },
  { id: 112, name: "Billy Butcher", origin: "The Boys" },
  { id: 113, name: "Omni-Man (Nolan Grayson)", origin: "Invincible" },
  { id: 114, name: "Invincible (Mark Grayson)", origin: "Invincible" },
  { id: 115, name: "Hellboy", origin: "Dark Horse Comics" },
  { id: 116, name: "Spawn (Al Simmons)", origin: "Image Comics" },
  { id: 117, name: "Rick Grimes", origin: "The Walking Dead" },
  { id: 118, name: "Negan", origin: "The Walking Dead" },
  { id: 119, name: "Michonne", origin: "The Walking Dead" },
  { id: 120, name: "Daryl Dixon", origin: "The Walking Dead" },
  { id: 121, name: "Leonardo", origin: "Teenage Mutant Ninja Turtles" },
  { id: 122, name: "Michelangelo", origin: "Teenage Mutant Ninja Turtles" },
  { id: 123, name: "Donatello", origin: "Teenage Mutant Ninja Turtles" },
  { id: 124, name: "Raphael", origin: "Teenage Mutant Ninja Turtles" },
  { id: 125, name: "Master Splinter", origin: "Teenage Mutant Ninja Turtles" },
  { id: 126, name: "Shredder", origin: "Teenage Mutant Ninja Turtles" },
  { id: 127, name: "Optimus Prime", origin: "Transformers" },
  { id: 128, name: "Megatron", origin: "Transformers" },
  { id: 129, name: "Bumblebee", origin: "Transformers" },
  { id: 130, name: "Starscream", origin: "Transformers" },
  { id: 131, name: "He-Man", origin: "Masters of the Universe" },
  { id: 132, name: "Skeletor", origin: "Masters of the Universe" },
  { id: 133, name: "Lion-O", origin: "ThunderCats" },
  { id: 134, name: "Cobra Commander", origin: "G.I. Joe" },
  { id: 135, name: "Snake Eyes", origin: "G.I. Joe" },
  { id: 136, name: "Tommy Oliver (Green/White Ranger)", origin: "Power Rangers" },
  { id: 137, name: "Rita Repulsa", origin: "Power Rangers" },
  { id: 138, name: "Super Mario", origin: "Super Mario" },
  { id: 139, name: "Luigi", origin: "Super Mario" },
  { id: 140, name: "Princess Peach", origin: "Super Mario" },
  { id: 141, name: "Bowser", origin: "Super Mario" },
  { id: 142, name: "Yoshi", origin: "Super Mario" },
  { id: 143, name: "Wario", origin: "Super Mario" },
  { id: 144, name: "Waluigi", origin: "Super Mario" },
  { id: 145, name: "Toad", origin: "Super Mario" },
  { id: 146, name: "Donkey Kong", origin: "Donkey Kong" },
  { id: 147, name: "Link", origin: "The Legend of Zelda" },
  { id: 148, name: "Princess Zelda", origin: "The Legend of Zelda" },
  { id: 149, name: "Ganondorf", origin: "The Legend of Zelda" },
  { id: 150, name: "Pikachu", origin: "Pok\xE9mon" },
  { id: 151, name: "Charizard", origin: "Pok\xE9mon" },
  { id: 152, name: "Mewtwo", origin: "Pok\xE9mon" },
  { id: 153, name: "Meowth", origin: "Pok\xE9mon" },
  { id: 154, name: "Sonic the Hedgehog", origin: "Sonic the Hedgehog" },
  { id: 155, name: "Dr. Eggman (Robotnik)", origin: "Sonic the Hedgehog" },
  { id: 156, name: 'Miles "Tails" Prower', origin: "Sonic the Hedgehog" },
  { id: 157, name: "Knuckles the Echidna", origin: "Sonic the Hedgehog" },
  { id: 158, name: "Shadow the Hedgehog", origin: "Sonic the Hedgehog" },
  { id: 159, name: "Kirby", origin: "Kirby" },
  { id: 160, name: "King Dedede", origin: "Kirby" },
  { id: 161, name: "Meta Knight", origin: "Kirby" },
  { id: 162, name: "Samus Aran", origin: "Metroid" },
  { id: 163, name: "Solid Snake", origin: "Metal Gear Solid" },
  { id: 164, name: "Big Boss", origin: "Metal Gear Solid" },
  { id: 165, name: "Raiden", origin: "Metal Gear Solid" },
  { id: 166, name: "Revolver Ocelot", origin: "Metal Gear Solid" },
  { id: 167, name: "Pac-Man", origin: "Pac-Man" },
  { id: 168, name: "Mega Man", origin: "Mega Man" },
  { id: 169, name: "Ryu", origin: "Street Fighter" },
  { id: 170, name: "Ken Masters", origin: "Street Fighter" },
  { id: 171, name: "Chun-Li", origin: "Street Fighter" },
  { id: 172, name: "M. Bison", origin: "Street Fighter" },
  { id: 173, name: "Guile", origin: "Street Fighter" },
  { id: 174, name: "Akuma", origin: "Street Fighter" },
  { id: 175, name: "Scorpion", origin: "Mortal Kombat" },
  { id: 176, name: "Sub-Zero", origin: "Mortal Kombat" },
  { id: 177, name: "Raiden", origin: "Mortal Kombat" },
  { id: 178, name: "Liu Kang", origin: "Mortal Kombat" },
  { id: 179, name: "Johnny Cage", origin: "Mortal Kombat" },
  { id: 180, name: "Shao Kahn", origin: "Mortal Kombat" },
  { id: 181, name: "Cloud Strife", origin: "Final Fantasy VII" },
  { id: 182, name: "Sephiroth", origin: "Final Fantasy VII" },
  { id: 183, name: "Tifa Lockhart", origin: "Final Fantasy VII" },
  { id: 184, name: "Aerith Gainsborough", origin: "Final Fantasy VII" },
  { id: 185, name: "Lara Croft", origin: "Tomb Raider" },
  { id: 186, name: "Master Chief", origin: "Halo" },
  { id: 187, name: "Cortana", origin: "Halo" },
  { id: 188, name: "Kratos", origin: "God of War" },
  { id: 189, name: "Doom Slayer (Doomguy)", origin: "DOOM" },
  { id: 190, name: "Geralt of Rivia", origin: "The Witcher" },
  { id: 191, name: "Arthur Morgan", origin: "Red Dead Redemption 2" },
  { id: 192, name: "John Marston", origin: "Red Dead Redemption" },
  { id: 193, name: "Trevor Philips", origin: "Grand Theft Auto V" },
  { id: 194, name: 'Carl "CJ" Johnson', origin: "Grand Theft Auto: San Andreas" },
  { id: 195, name: "Niko Bellic", origin: "Grand Theft Auto IV" },
  { id: 196, name: "Leon S. Kennedy", origin: "Resident Evil" },
  { id: 197, name: "Jill Valentine", origin: "Resident Evil" },
  { id: 198, name: "Albert Wesker", origin: "Resident Evil" },
  { id: 199, name: "Lady Dimitrescu", origin: "Resident Evil" },
  { id: 200, name: "Nemesis", origin: "Resident Evil" },
  { id: 201, name: "Crash Bandicoot", origin: "Crash Bandicoot" },
  { id: 202, name: "Dr. Neo Cortex", origin: "Crash Bandicoot" },
  { id: 203, name: "Spyro the Dragon", origin: "Spyro" },
  { id: 204, name: "Ezio Auditore", origin: "Assassin's Creed" },
  { id: 205, name: "Agent 47", origin: "Hitman" },
  { id: 206, name: "Gordon Freeman", origin: "Half-Life" },
  { id: 207, name: "GLaDOS", origin: "Portal" },
  { id: 208, name: "Steve", origin: "Minecraft" },
  { id: 209, name: "Creeper", origin: "Minecraft" },
  { id: 210, name: "Sans", origin: "Undertale" },
  { id: 211, name: "Freddy Fazbear", origin: "Five Nights at Freddy's" },
  { id: 212, name: "Springtrap (William Afton)", origin: "Five Nights at Freddy's" },
  { id: 213, name: "Joel Miller", origin: "The Last of Us" },
  { id: 214, name: "Ellie", origin: "The Last of Us" },
  { id: 215, name: "Nathan Drake", origin: "Uncharted" },
  { id: 216, name: "Dante", origin: "Devil May Cry" },
  { id: 217, name: "Vergil", origin: "Devil May Cry" },
  { id: 218, name: "Bayonetta", origin: "Bayonetta" },
  { id: 219, name: "2B", origin: "NieR:Automata" },
  { id: 220, name: "Sora", origin: "Kingdom Hearts" },
  { id: 221, name: "Commander Shepard", origin: "Mass Effect" },
  { id: 222, name: "Vault Boy", origin: "Fallout" },
  { id: 223, name: "Alduin", origin: "The Elder Scrolls V: Skyrim" },
  { id: 224, name: "Dovahkiin (Dragonborn)", origin: "The Elder Scrolls V: Skyrim" },
  { id: 225, name: "Handsome Jack", origin: "Borderlands" },
  { id: 226, name: "Claptrap", origin: "Borderlands" },
  { id: 227, name: "Tracer", origin: "Overwatch" },
  { id: 228, name: "Genji", origin: "Overwatch" },
  { id: 229, name: "Reaper", origin: "Overwatch" },
  { id: 230, name: "Jinx", origin: "League of Legends / Arcane" },
  { id: 231, name: "Vi", origin: "League of Legends / Arcane" },
  { id: 232, name: "Heihachi Mishima", origin: "Tekken" },
  { id: 233, name: "Kazuya Mishima", origin: "Tekken" },
  { id: 234, name: "Mickey Mouse", origin: "Disney" },
  { id: 235, name: "Donald Duck", origin: "Disney" },
  { id: 236, name: "Goofy", origin: "Disney" },
  { id: 237, name: "Scrooge McDuck", origin: "Disney" },
  { id: 238, name: "Maleficent", origin: "Sleeping Beauty" },
  { id: 239, name: "Ursula", origin: "The Little Mermaid" },
  { id: 240, name: "Ariel", origin: "The Little Mermaid" },
  { id: 241, name: "Aladdin", origin: "Aladdin" },
  { id: 242, name: "The Genie", origin: "Aladdin" },
  { id: 243, name: "Jafar", origin: "Aladdin" },
  { id: 244, name: "Simba", origin: "The Lion King" },
  { id: 245, name: "Mufasa", origin: "The Lion King" },
  { id: 246, name: "Scar", origin: "The Lion King" },
  { id: 247, name: "Timon & Pumbaa", origin: "The Lion King" },
  { id: 248, name: "Mulan", origin: "Mulan" },
  { id: 249, name: "Mushu", origin: "Mulan" },
  { id: 250, name: "Hercules", origin: "Hercules" },
  { id: 251, name: "Hades", origin: "Hercules" },
  { id: 252, name: "Stitch", origin: "Lilo & Stitch" },
  { id: 253, name: "Elsa", origin: "Frozen" },
  { id: 254, name: "Olaf", origin: "Frozen" },
  { id: 255, name: "Moana", origin: "Moana" },
  { id: 256, name: "Maui", origin: "Moana" },
  { id: 257, name: "Jack Skellington", origin: "The Nightmare Before Christmas" },
  { id: 258, name: "Cruella de Vil", origin: "101 Dalmatians" },
  { id: 259, name: "Captain Hook", origin: "Peter Pan" },
  { id: 260, name: "Peter Pan", origin: "Peter Pan" },
  { id: 261, name: "Tinker Bell", origin: "Peter Pan" },
  { id: 262, name: "Winnie the Pooh", origin: "Winnie the Pooh" },
  { id: 263, name: "Tigger", origin: "Winnie the Pooh" },
  { id: 264, name: "Eeyore", origin: "Winnie the Pooh" },
  { id: 265, name: "Woody", origin: "Toy Story" },
  { id: 266, name: "Buzz Lightyear", origin: "Toy Story" },
  { id: 267, name: "Mr. Incredible (Bob Parr)", origin: "The Incredibles" },
  { id: 268, name: "Edna Mode", origin: "The Incredibles" },
  { id: 269, name: "Syndrome", origin: "The Incredibles" },
  { id: 270, name: "Mike Wazowski", origin: "Monsters, Inc." },
  { id: 271, name: 'James P. "Sulley" Sullivan', origin: "Monsters, Inc." },
  { id: 272, name: "Lightning McQueen", origin: "Cars" },
  { id: 273, name: "Tow Mater", origin: "Cars" },
  { id: 274, name: "WALL-E", origin: "WALL-E" },
  { id: 275, name: "Remy", origin: "Ratatouille" },
  { id: 276, name: "Shrek", origin: "Shrek" },
  { id: 277, name: "Donkey", origin: "Shrek" },
  { id: 278, name: "Puss in Boots", origin: "Shrek" },
  { id: 279, name: "Lord Farquaad", origin: "Shrek" },
  { id: 280, name: "Po", origin: "Kung Fu Panda" },
  { id: 281, name: "Tai Lung", origin: "Kung Fu Panda" },
  { id: 282, name: "Hiccup", origin: "How to Train Your Dragon" },
  { id: 283, name: "Toothless", origin: "How to Train Your Dragon" },
  { id: 284, name: "Gru", origin: "Despicable Me" },
  { id: 285, name: "Minions (Kevin, Stuart, Bob)", origin: "Despicable Me" },
  { id: 286, name: "Megamind", origin: "Megamind" },
  { id: 287, name: "SpongeBob SquarePants", origin: "SpongeBob SquarePants" },
  { id: 288, name: "Patrick Star", origin: "SpongeBob SquarePants" },
  { id: 289, name: "Squidward Tentacles", origin: "SpongeBob SquarePants" },
  { id: 290, name: "Mr. Krabs", origin: "SpongeBob SquarePants" },
  { id: 291, name: "Plankton", origin: "SpongeBob SquarePants" },
  { id: 292, name: "Homer Simpson", origin: "The Simpsons" },
  { id: 293, name: "Bart Simpson", origin: "The Simpsons" },
  { id: 294, name: "Lisa Simpson", origin: "The Simpsons" },
  { id: 295, name: "Mr. Burns", origin: "The Simpsons" },
  { id: 296, name: "Ned Flanders", origin: "The Simpsons" },
  { id: 297, name: "Krusty the Clown", origin: "The Simpsons" },
  { id: 298, name: "Peter Griffin", origin: "Family Guy" },
  { id: 299, name: "Stewie Griffin", origin: "Family Guy" },
  { id: 300, name: "Brian Griffin", origin: "Family Guy" },
  { id: 301, name: "Glenn Quagmire", origin: "Family Guy" },
  { id: 302, name: "Eric Cartman", origin: "South Park" },
  { id: 303, name: "Kenny McCormick", origin: "South Park" },
  { id: 304, name: "Randy Marsh", origin: "South Park" },
  { id: 305, name: "Rick Sanchez", origin: "Rick and Morty" },
  { id: 306, name: "Morty Smith", origin: "Rick and Morty" },
  { id: 307, name: "Bender Bending Rodr\xEDguez", origin: "Futurama" },
  { id: 308, name: "Philip J. Fry", origin: "Futurama" },
  { id: 309, name: "Dr. Zoidberg", origin: "Futurama" },
  { id: 310, name: "BoJack Horseman", origin: "BoJack Horseman" },
  { id: 311, name: "Sterling Archer", origin: "Archer" },
  { id: 312, name: "Bob Belcher", origin: "Bob's Burgers" },
  { id: 313, name: "Hank Hill", origin: "King of the Hill" },
  { id: 314, name: "Bugs Bunny", origin: "Looney Tunes" },
  { id: 315, name: "Daffy Duck", origin: "Looney Tunes" },
  { id: 316, name: "Porky Pig", origin: "Looney Tunes" },
  { id: 317, name: "Wile E. Coyote", origin: "Looney Tunes" },
  { id: 318, name: "Road Runner", origin: "Looney Tunes" },
  { id: 319, name: "Marvin the Martian", origin: "Looney Tunes" },
  { id: 320, name: "Yosemite Sam", origin: "Looney Tunes" },
  { id: 321, name: "Tasmanian Devil (Taz)", origin: "Looney Tunes" },
  { id: 322, name: "Tom Cat", origin: "Tom and Jerry" },
  { id: 323, name: "Jerry Mouse", origin: "Tom and Jerry" },
  { id: 324, name: "Scooby-Doo", origin: "Scooby-Doo" },
  { id: 325, name: "Shaggy Rogers", origin: "Scooby-Doo" },
  { id: 326, name: "Fred Flintstone", origin: "The Flintstones" },
  { id: 327, name: "Popeye the Sailor", origin: "Popeye" },
  { id: 328, name: "Garfield", origin: "Garfield" },
  { id: 329, name: "Snoopy", origin: "Peanuts" },
  { id: 330, name: "Charlie Brown", origin: "Peanuts" },
  { id: 331, name: "Pink Panther", origin: "The Pink Panther" },
  { id: 332, name: "Aang", origin: "Avatar: The Last Airbender" },
  { id: 333, name: "Zuko", origin: "Avatar: The Last Airbender" },
  { id: 334, name: "Uncle Iroh", origin: "Avatar: The Last Airbender" },
  { id: 335, name: "Toph Beifong", origin: "Avatar: The Last Airbender" },
  { id: 336, name: "Samurai Jack", origin: "Samurai Jack" },
  { id: 337, name: "Aku", origin: "Samurai Jack" },
  { id: 338, name: "Ben Tennyson (Ben 10)", origin: "Ben 10" },
  { id: 339, name: "Dexter", origin: "Dexter's Laboratory" },
  { id: 340, name: "Mojo Jojo", origin: "The Powerpuff Girls" },
  { id: 341, name: "Courage", origin: "Courage the Cowardly Dog" },
  { id: 342, name: "Johnny Bravo", origin: "Johnny Bravo" },
  { id: 343, name: "Finn the Human", origin: "Adventure Time" },
  { id: 344, name: "Jake the Dog", origin: "Adventure Time" },
  { id: 345, name: "Ice King (Simon Petrikov)", origin: "Adventure Time" },
  { id: 346, name: "Bill Cipher", origin: "Gravity Falls" },
  { id: 347, name: "Grunkle Stan", origin: "Gravity Falls" },
  { id: 348, name: "Dr. Heinz Doofenshmirtz", origin: "Phineas and Ferb" },
  { id: 349, name: "Perry the Platypus", origin: "Phineas and Ferb" },
  { id: 350, name: "Cosmo & Wanda", origin: "The Fairly OddParents" },
  { id: 351, name: "Danny Phantom", origin: "Danny Phantom" },
  { id: 352, name: "Kim Possible", origin: "Kim Possible" },
  { id: 353, name: "Shego", origin: "Kim Possible" },
  { id: 354, name: "Walter White (Heisenberg)", origin: "Breaking Bad" },
  { id: 355, name: "Jesse Pinkman", origin: "Breaking Bad" },
  { id: 356, name: "Saul Goodman (Jimmy McGill)", origin: "Breaking Bad / Better Call Saul" },
  { id: 357, name: "Gus Fring", origin: "Breaking Bad" },
  { id: 358, name: "Mike Ehrmantraut", origin: "Breaking Bad" },
  { id: 359, name: "Tony Soprano", origin: "The Sopranos" },
  { id: 360, name: "Omar Little", origin: "The Wire" },
  { id: 361, name: "Jon Snow", origin: "Game of Thrones" },
  { id: 362, name: "Daenerys Targaryen", origin: "Game of Thrones" },
  { id: 363, name: "Tyrion Lannister", origin: "Game of Thrones" },
  { id: 364, name: "Cersei Lannister", origin: "Game of Thrones" },
  { id: 365, name: "Arya Stark", origin: "Game of Thrones" },
  { id: 366, name: "The Night King", origin: "Game of Thrones" },
  { id: 367, name: "Michael Scott", origin: "The Office" },
  { id: 368, name: "Dwight Schrute", origin: "The Office" },
  { id: 369, name: "Ron Swanson", origin: "Parks and Recreation" },
  { id: 370, name: "Sheldon Cooper", origin: "The Big Bang Theory" },
  { id: 371, name: "Joey Tribbiani", origin: "Friends" },
  { id: 372, name: "Cosmo Kramer", origin: "Seinfeld" },
  { id: 373, name: "George Costanza", origin: "Seinfeld" },
  { id: 374, name: "The Doctor", origin: "Doctor Who" },
  { id: 375, name: "Dalek", origin: "Doctor Who" },
  { id: 376, name: "Spock", origin: "Star Trek" },
  { id: 377, name: "Captain James T. Kirk", origin: "Star Trek" },
  { id: 378, name: "Captain Jean-Luc Picard", origin: "Star Trek" },
  { id: 379, name: "Eleven", origin: "Stranger Things" },
  { id: 380, name: "Vecna", origin: "Stranger Things" },
  { id: 381, name: "Wednesday Addams", origin: "The Addams Family" },
  { id: 382, name: "Dexter Morgan", origin: "Dexter" },
  { id: 383, name: "Gregory House", origin: "House, M.D." },
  { id: 384, name: "Thomas Shelby", origin: "Peaky Blinders" },
  { id: 385, name: "Ted Lasso", origin: "Ted Lasso" },
  { id: 386, name: "Mr. Bean", origin: "Mr. Bean" },
  { id: 387, name: "Kermit the Frog", origin: "The Muppets" },
  { id: 388, name: "Miss Piggy", origin: "The Muppets" },
  { id: 389, name: "Elmo", origin: "Sesame Street" },
  { id: 390, name: "Cookie Monster", origin: "Sesame Street" },
  { id: 391, name: "Big Bird", origin: "Sesame Street" },
  { id: 392, name: "The Terminator (T-800)", origin: "The Terminator" },
  { id: 393, name: "Sarah Connor", origin: "The Terminator" },
  { id: 394, name: "Ellen Ripley", origin: "Alien" },
  { id: 395, name: "Xenomorph", origin: "Alien" },
  { id: 396, name: "Predator (Yautja)", origin: "Predator" },
  { id: 397, name: "John Wick", origin: "John Wick" },
  { id: 398, name: "Neo", origin: "The Matrix" },
  { id: 399, name: "Agent Smith", origin: "The Matrix" },
  { id: 400, name: "Morpheus", origin: "The Matrix" },
  { id: 401, name: "Marty McFly", origin: "Back to the Future" },
  { id: 402, name: "Doc Brown", origin: "Back to the Future" },
  { id: 403, name: "Captain Jack Sparrow", origin: "Pirates of the Caribbean" },
  { id: 404, name: "Davy Jones", origin: "Pirates of the Caribbean" },
  { id: 405, name: "Forrest Gump", origin: "Forrest Gump" },
  { id: 406, name: "The Bride (Beatrix Kiddo)", origin: "Kill Bill" },
  { id: 407, name: "Tyler Durden", origin: "Fight Club" },
  { id: 408, name: "The Dude (Jeffrey Lebowski)", origin: "The Big Lebowski" },
  { id: 409, name: "Tony Montana", origin: "Scarface" },
  { id: 410, name: "Vito Corleone", origin: "The Godfather" },
  { id: 411, name: "Michael Corleone", origin: "The Godfather" },
  { id: 412, name: "Rocky Balboa", origin: "Rocky" },
  { id: 413, name: "John Rambo", origin: "Rambo" },
  { id: 414, name: "John McClane", origin: "Die Hard" },
  { id: 415, name: "Maximus Decimus Meridius", origin: "Gladiator" },
  { id: 416, name: "Hannibal Lecter", origin: "The Silence of the Lambs" },
  { id: 417, name: "Michael Myers", origin: "Halloween" },
  { id: 418, name: "Jason Voorhees", origin: "Friday the 13th" },
  { id: 419, name: "Freddy Krueger", origin: "A Nightmare on Elm Street" },
  { id: 420, name: "Ghostface", origin: "Scream" },
  { id: 421, name: "Pennywise", origin: "It" },
  { id: 422, name: "Chucky", origin: "Child's Play" },
  { id: 423, name: "Jigsaw (John Kramer)", origin: "Saw" },
  { id: 424, name: "Godzilla", origin: "Godzilla" },
  { id: 425, name: "King Kong", origin: "King Kong" },
  { id: 426, name: "Count Dracula", origin: "Dracula" },
  { id: 427, name: "Frankenstein's Monster", origin: "Frankenstein" },
  { id: 428, name: "Willy Wonka", origin: "Charlie and the Chocolate Factory" },
  { id: 429, name: "Katniss Everdeen", origin: "The Hunger Games" },
  { id: 430, name: "Paul Atreides", origin: "Dune" },
  { id: 431, name: "Ronald McDonald", origin: "McDonald's" },
  { id: 432, name: "Colonel Sanders", origin: "KFC" },
  { id: 433, name: "The Burger King", origin: "Burger King" },
  { id: 434, name: "Tony the Tiger", origin: "Kellogg's Frosted Flakes" },
  { id: 435, name: "Chester Cheetah", origin: "Cheetos" },
  { id: 436, name: "Mr. Clean", origin: "Mr. Clean" },
  { id: 437, name: "Kool-Aid Man", origin: "Kool-Aid" },
  { id: 438, name: "Pillsbury Doughboy", origin: "Pillsbury" },
  { id: 439, name: "Michelin Man (Bibendum)", origin: "Michelin" },
  { id: 440, name: "Chuck Norris", origin: "Celebrity / Pop Culture" },
  { id: 441, name: "Hulk Hogan", origin: "WWE / Pop Culture" },
  { id: 442, name: "John Cena", origin: "WWE / Pop Culture" },
  { id: 443, name: "Gordon Ramsay", origin: "Celebrity / Culinary TV" },
  { id: 444, name: "Dorothy Gale", origin: "The Wizard of Oz" },
  { id: 445, name: "The Tramp", origin: "Charlie Chaplin Films" },
  { id: 446, name: "Lucy Ricardo", origin: "I Love Lucy" },
  { id: 447, name: "Archie Bunker", origin: "All in the Family" },
  { id: 448, name: "Barbie", origin: "Mattel / Barbie" },
  { id: 449, name: "Scarlett O'Hara", origin: "Gone with the Wind" },
  { id: 450, name: "Tarzan", origin: "Tarzan of the Apes" },
  { id: 451, name: "Holden Caulfield", origin: "The Catcher in the Rye" },
  { id: 452, name: "Laurel and Hardy", origin: "Hal Roach Studios" },
  { id: 453, name: "Moe, Larry, and Curly", origin: "The Three Stooges" },
  { id: 454, name: "Norman Bates", origin: "Psycho" },
  { id: 455, name: "Charles Foster Kane", origin: "Citizen Kane" },
  { id: 456, name: "Rick Blaine", origin: "Casablanca" },
  { id: 457, name: "The Man With No Name", origin: "Dollars Trilogy" },
  { id: 458, name: "E.T.", origin: "E.T. the Extra-Terrestrial" },
  { id: 459, name: "Thomas the Tank Engine", origin: "The Railway Series / Thomas & Friends" },
  { id: 460, name: 'Arthur "Fonzie" Fonzarelli', origin: "Happy Days" },
  { id: 461, name: "Philip Marlowe", origin: "The Big Sleep" },
  { id: 462, name: "Jay Gatsby", origin: "The Great Gatsby" },
  { id: 463, name: "Lassie", origin: "Lassie Come-Home" },
  { id: 464, name: "Zorro", origin: "The Mark of Zorro" },
  { id: 465, name: "Mary Poppins", origin: "Mary Poppins" },
  { id: 466, name: "Holly Golightly", origin: "Breakfast at Tiffany's" },
  { id: 467, name: "The Grinch", origin: "How the Grinch Stole Christmas!" },
  { id: 468, name: "Sam Malone", origin: "Cheers" },
  { id: 469, name: "Frasier Crane", origin: "Cheers / Frasier" },
  { id: 470, name: "Jerry Seinfeld", origin: "Seinfeld" },
  { id: 471, name: "Jules Winnfield", origin: "Pulp Fiction" },
  { id: 472, name: "Ralph Kramden", origin: "The Honeymooners" },
  { id: 473, name: "Edward Scissorhands", origin: "Edward Scissorhands" },
  { id: 474, name: "Bambi", origin: "Bambi" },
  { id: 475, name: "Waldo (Wally)", origin: "Where's Waldo?" },
  { id: 476, name: "Buffy Summers", origin: "Buffy the Vampire Slayer" },
  { id: 477, name: "Ron Burgundy", origin: "Anchorman" },
  { id: 478, name: "Betty Boop", origin: "Fleischer Studios" },
  { id: 479, name: "Tom Joad", origin: "The Grapes of Wrath" },
  { id: 480, name: "Rooster Cogburn", origin: "True Grit" },
  { id: 481, name: "Santa Claus", origin: "Folklore / Pop Culture" },
  { id: 482, name: "Robin Hood", origin: "Folklore / Literature" },
  { id: 483, name: "Cinderella", origin: "Fairy Tale / Disney" },
  { id: 484, name: "Snow White", origin: "Fairy Tale / Disney" },
  { id: 485, name: "Pinocchio", origin: "The Adventures of Pinocchio / Disney" },
  { id: 486, name: "Alice", origin: "Alice's Adventures in Wonderland" },
  { id: 487, name: "Ebenezer Scrooge", origin: "A Christmas Carol" },
  { id: 488, name: "Huckleberry Finn", origin: "Adventures of Huckleberry Finn" },
  { id: 489, name: "Tom Sawyer", origin: "The Adventures of Tom Sawyer" },
  { id: 490, name: "Odysseus", origin: "The Odyssey" },
  { id: 491, name: "Romeo & Juliet", origin: "Romeo and Juliet" },
  { id: 492, name: "Prince Hamlet", origin: "Hamlet" },
  { id: 493, name: "Don Quixote", origin: "Don Quixote" },
  { id: 494, name: "Oliver Twist", origin: "Oliver Twist" },
  { id: 495, name: "Uncle Sam", origin: "Americana / Pop Culture" },
  { id: 496, name: "Paul Bunyan", origin: "American Folklore" },
  { id: 497, name: "Rip Van Winkle", origin: "Rip Van Winkle" },
  { id: 498, name: "Ichabod Crane", origin: "The Legend of Sleepy Hollow" },
  { id: 499, name: 'Dwayne "The Rock" Johnson', origin: "Actor / WWE" },
  { id: 500, name: "Johnny Depp", origin: "Actor" },
  { id: 501, name: "Leonardo DiCaprio", origin: "Actor" },
  { id: 502, name: "Brad Pitt", origin: "Actor" },
  { id: 503, name: "Tom Cruise", origin: "Actor" },
  { id: 504, name: "Robert Downey Jr.", origin: "Actor" },
  { id: 505, name: "Arnold Schwarzenegger", origin: "Actor / Politician" },
  { id: 506, name: "Sylvester Stallone", origin: "Actor" },
  { id: 507, name: "Keanu Reeves", origin: "Actor" },
  { id: 508, name: "Samuel L. Jackson", origin: "Actor" },
  { id: 509, name: "Morgan Freeman", origin: "Actor" },
  { id: 510, name: "Tom Hanks", origin: "Actor" },
  { id: 511, name: "Harrison Ford", origin: "Actor" },
  { id: 512, name: "Clint Eastwood", origin: "Actor / Director" },
  { id: 513, name: "Jack Nicholson", origin: "Actor" },
  { id: 514, name: "Al Pacino", origin: "Actor" },
  { id: 515, name: "Robert De Niro", origin: "Actor" },
  { id: 516, name: "Anthony Hopkins", origin: "Actor" },
  { id: 517, name: "Denzel Washington", origin: "Actor" },
  { id: 518, name: "Will Smith", origin: "Actor / Musician" },
  { id: 519, name: "Jim Carrey", origin: "Actor / Comedian" },
  { id: 520, name: "Robin Williams", origin: "Actor / Comedian" },
  { id: 521, name: "Jackie Chan", origin: "Actor / Martial Artist" },
  { id: 522, name: "Bruce Lee", origin: "Actor / Martial Artist" },
  { id: 523, name: "Marilyn Monroe", origin: "Actress / Pop Icon" },
  { id: 524, name: "Audrey Hepburn", origin: "Actress" },
  { id: 525, name: "Meryl Streep", origin: "Actress" },
  { id: 526, name: "Scarlett Johansson", origin: "Actress" },
  { id: 527, name: "Angelina Jolie", origin: "Actress" },
  { id: 528, name: "Margot Robbie", origin: "Actress" },
  { id: 529, name: "Jennifer Lawrence", origin: "Actress" },
  { id: 530, name: "Natalie Portman", origin: "Actress" },
  { id: 531, name: "Emma Stone", origin: "Actress" },
  { id: 532, name: "Zendaya", origin: "Actress" },
  { id: 533, name: "Ryan Reynolds", origin: "Actor" },
  { id: 534, name: "Hugh Jackman", origin: "Actor" },
  { id: 535, name: "Christian Bale", origin: "Actor" },
  { id: 536, name: "Cillian Murphy", origin: "Actor" },
  { id: 537, name: "Pedro Pascal", origin: "Actor" },
  { id: 538, name: "Timoth\xE9e Chalamet", origin: "Actor" },
  { id: 539, name: "Nicolas Cage", origin: "Actor" },
  { id: 540, name: "Danny DeVito", origin: "Actor" },
  { id: 541, name: "Jack Black", origin: "Actor / Musician" },
  { id: 542, name: "Willem Dafoe", origin: "Actor" },
  { id: 543, name: "Rowan Atkinson", origin: "Actor / Comedian" }
];

// server.ts
dotenv.config();
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json());
var aiClient = null;
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var commonalitiesList = Array.isArray(Commonalities_6c05b138_default) ? Commonalities_6c05b138_default : [];
var topCharactersList = Array.isArray(TopCharacters_b19eb45c_default) ? TopCharacters_b19eb45c_default : [];
if (commonalitiesList.length === 0) {
  try {
    const commPath = path.resolve(process.cwd(), "public/assets/aistudio/Commonalities_6c05b138.json");
    if (fs.existsSync(commPath)) {
      commonalitiesList = JSON.parse(fs.readFileSync(commPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load Commonalities JSON:", err);
  }
}
if (topCharactersList.length === 0) {
  try {
    const topCharsPath = path.resolve(process.cwd(), "public/assets/aistudio/TopCharacters_b19eb45c.json");
    if (fs.existsSync(topCharsPath)) {
      topCharactersList = JSON.parse(fs.readFileSync(topCharsPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load TopCharacters JSON:", err);
  }
}
if (commonalitiesList.length === 0) {
  commonalitiesList = [
    { id: 1, trait: "Both characters have artificial, robotic, or cybernetic limbs." },
    { id: 2, trait: "Both characters are known for an iconic scar, eyepatch, or facial marking." },
    { id: 4, trait: "Both characters conceal their true face behind a mask, helmet, or heavy disguise." },
    { id: 12, trait: "Both characters are fathers." },
    { id: 24, trait: "Both characters wield a legendary, named weapon." },
    { id: 29, trait: "Both characters possess the ability to travel through time." },
    { id: 35, trait: "Both characters are morally grey antiheroes." },
    { id: 52, trait: "Both characters work as cynical private investigators, detectives, or bounty hunters." },
    { id: 71, trait: "Both characters are completely bald or lack any head hair by design." }
  ];
}
function formatThemeName(trait) {
  let name = trait.trim();
  if (/^Both characters\b/i.test(name)) {
    name = name.replace(/^Both characters\b/i, "All characters");
  } else if (!/^All characters\b/i.test(name)) {
    name = `All characters ${name.charAt(0).toLowerCase() + name.slice(1)}`;
  }
  return name.replace(/\.$/, "");
}
function findVerifiedCategoryForTrait(trait) {
  const lower = trait.toLowerCase();
  for (const cat of VERIFIED_CATEGORIES) {
    if (cat.keywords.some((k) => {
      const escaped = k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
    })) {
      return cat;
    }
    if (cat.trait.toLowerCase() === lower || cat.name.toLowerCase() === lower) {
      return cat;
    }
  }
  return null;
}
var geminiCallQueue = Promise.resolve();
function runGeminiQueued(task) {
  const next = geminiCallQueue.then(task, task);
  geminiCallQueue = next.then(() => {
  }, () => {
  });
  return next;
}
async function callGeminiSafe(ai, prompt, config = { responseMimeType: "application/json" }) {
  return runGeminiQueued(async () => {
    const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config
          });
          const text = response.text?.trim();
          if (text) return text;
        } catch (err) {
          const msg = String(err?.message || "");
          const isTemporary = err?.status === 503 || err?.status === 429 || msg.includes("503") || msg.includes("high demand") || msg.includes("RESOURCE_EXHAUSTED");
          if (isTemporary && attempt === 0) {
            await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
            continue;
          }
          break;
        }
      }
    }
    return null;
  });
}
var themeCache = /* @__PURE__ */ new Map();
async function generateRoundTheme(playerCount = 4, excludeIds = [], specificCommonalityId, specificTrait) {
  let selectedCommonality;
  if (specificCommonalityId) {
    const found = commonalitiesList.find((c) => c.id === specificCommonalityId);
    selectedCommonality = found || { id: specificCommonalityId, trait: specificTrait || "Both characters wear iconic accessories." };
  } else if (specificTrait) {
    const found = commonalitiesList.find((c) => c.trait.toLowerCase() === specificTrait.toLowerCase());
    selectedCommonality = found || { id: Date.now() % 1e4, trait: specificTrait };
  } else {
    const candidatePool = commonalitiesList.filter((c) => !excludeIds.includes(c.id));
    const pool = candidatePool.length > 0 ? candidatePool : commonalitiesList;
    selectedCommonality = pool[Math.floor(Math.random() * pool.length)];
  }
  const cacheKey = `comm-${selectedCommonality.id || selectedCommonality.trait}`;
  if (themeCache.has(cacheKey)) {
    const cached = themeCache.get(cacheKey);
    const shuffledChars = [...cached.characters].sort(() => Math.random() - 0.5);
    return {
      ...cached,
      id: `commonality-${selectedCommonality.id}-${Date.now()}`,
      characters: shuffledChars
    };
  }
  const verifiedCat = findVerifiedCategoryForTrait(selectedCommonality.trait);
  const themeName = formatThemeName(selectedCommonality.trait);
  if (verifiedCat && verifiedCat.characters.length >= Math.max(playerCount * 2, 8)) {
    const verifiedChars = verifiedCat.characters.map((c) => ({
      name: c.name,
      origin: c.origin,
      wikiSlug: c.wikiSlug,
      hint: c.hint,
      traitVerification: c.traitVerification,
      imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`
    }));
    const resultTheme = {
      id: `commonality-${selectedCommonality.id}-${Date.now()}`,
      commonalityId: selectedCommonality.id,
      name: themeName,
      characters: verifiedChars
    };
    themeCache.set(cacheKey, resultTheme);
    return resultTheme;
  }
  const ai = getAI();
  if (ai) {
    const targetCount = 12;
    const verifiedExamples = verifiedCat ? `Verified Canonical Matches for reference: ${verifiedCat.characters.slice(0, 6).map((c) => c.name).join(", ")}` : "";
    const prompt = `You are a strict trivia and pop culture verifier for the party game "Jest Guessing".
Round Commonality Trait: "${selectedCommonality.trait}"
Theme Title: "${themeName}"

CRITICAL ACCURACY REQUIREMENT:
Every single character MUST strictly, canonically, and undeniably possess this exact commonality trait: "${selectedCommonality.trait}".
Do NOT include characters who do not possess this trait (e.g. if the trait is wearing glasses/spectacles/goggles, characters like Mushu, Kramer, Batman, or Mario do NOT wear glasses and must NEVER be included).
${verifiedExamples}

INSTRUCTIONS:
1. Provide ${targetCount} famous, widely recognizable characters from movies, TV, literature, gaming, animation, or history who strictly possess this trait.
2. For each character, provide "traitVerification": concise 1-sentence confirmation of how they satisfy the trait (max 10 words).
3. Provide recognized "name", "origin" (where they are from), and exact English Wikipedia "wikiSlug".

Return ONLY a JSON object:
{
  "name": "${themeName}",
  "characters": [
    {
      "name": "Full Character Name",
      "origin": "Franchise or Universe",
      "wikiSlug": "Wikipedia_Article_Slug",
      "hint": "Subtle clue (max 10 words)",
      "traitVerification": "Concisely how they satisfy the trait"
    }
  ]
}`;
    const text = await callGeminiSafe(ai, prompt);
    if (text) {
      try {
        const cleaned = text.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.characters && Array.isArray(parsed.characters) && parsed.characters.length >= 4) {
          const seenNames = /* @__PURE__ */ new Set();
          const mergedChars = [];
          if (verifiedCat) {
            for (const c of verifiedCat.characters) {
              seenNames.add(c.name.toLowerCase());
              mergedChars.push({
                name: c.name,
                origin: c.origin,
                wikiSlug: c.wikiSlug,
                hint: c.hint,
                traitVerification: c.traitVerification,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`
              });
            }
          }
          for (const c of parsed.characters) {
            const lower = (c.name || "").toLowerCase();
            if (lower && !seenNames.has(lower)) {
              seenNames.add(lower);
              mergedChars.push({
                name: c.name,
                origin: c.origin || "Pop Culture",
                wikiSlug: c.wikiSlug || c.name.replace(/\s+/g, "_"),
                hint: c.hint || `Matches ${themeName}`,
                traitVerification: c.traitVerification,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug || c.name)}?width=400`
              });
            }
          }
          const resultTheme = {
            id: `commonality-${selectedCommonality.id}-${Date.now()}`,
            commonalityId: selectedCommonality.id,
            name: themeName,
            characters: mergedChars
          };
          themeCache.set(cacheKey, resultTheme);
          return resultTheme;
        }
      } catch {
      }
    }
  }
  let fallbackCat = verifiedCat;
  if (!fallbackCat) {
    fallbackCat = VERIFIED_CATEGORIES[Math.floor(Math.random() * VERIFIED_CATEGORIES.length)];
  }
  const fallbackChars = fallbackCat.characters.map((c) => ({
    name: c.name,
    origin: c.origin,
    wikiSlug: c.wikiSlug,
    hint: c.hint,
    traitVerification: c.traitVerification,
    imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(c.wikiSlug)}?width=400`
  }));
  const fallbackResult = {
    id: `commonality-${selectedCommonality.id}-${Date.now()}`,
    commonalityId: selectedCommonality.id,
    name: themeName,
    characters: fallbackChars
  };
  themeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}
app.post("/api/round-theme", async (req, res) => {
  try {
    const {
      players = [],
      excludeCommonalityIds = [],
      specificCommonalityId,
      specificTrait
    } = req.body || {};
    const count = Array.isArray(players) && players.length > 0 ? players.length : 4;
    const theme = await generateRoundTheme(count, excludeCommonalityIds, specificCommonalityId, specificTrait);
    res.json(theme);
  } catch (err) {
    console.error("Error in /api/round-theme:", err);
    res.status(500).json({ error: "Failed to generate round theme" });
  }
});
app.get("/api/candidate-commonalities", (req, res) => {
  try {
    const excludeIds = req.query.exclude ? String(req.query.exclude).split(",").map(Number) : [];
    const verifiedIds = [];
    commonalitiesList.forEach((c) => {
      if (findVerifiedCategoryForTrait(c.trait)) {
        verifiedIds.push(c.id);
      }
    });
    const unplayedVerified = commonalitiesList.filter(
      (c) => verifiedIds.includes(c.id) && !excludeIds.includes(c.id)
    );
    const pool = unplayedVerified.length >= 3 ? unplayedVerified : commonalitiesList.filter((c) => !excludeIds.includes(c.id));
    const source = pool.length >= 3 ? pool : commonalitiesList;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    const candidates = shuffled.slice(0, 3).map((c) => ({
      id: c.id,
      trait: c.trait,
      formattedName: formatThemeName(c.trait)
    }));
    res.json({ candidates });
  } catch (err) {
    console.error("Error in /api/candidate-commonalities:", err);
    res.status(500).json({ error: "Failed to fetch candidate commonalities" });
  }
});
app.post("/api/reroll-character", async (req, res) => {
  try {
    const { trait = "", excludeSlugs = [], excludeNames = [] } = req.body || {};
    const excludeSet = /* @__PURE__ */ new Set([
      ...excludeSlugs.map((s) => String(s).toLowerCase()),
      ...excludeNames.map((n) => String(n).toLowerCase())
    ]);
    const cat = findVerifiedCategoryForTrait(trait);
    if (cat) {
      const candidates = cat.characters.filter(
        (c) => !excludeSet.has(c.wikiSlug.toLowerCase()) && !excludeSet.has(c.name.toLowerCase())
      );
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        return res.json({
          character: {
            ...pick,
            imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(pick.wikiSlug)}?width=400`
          }
        });
      }
    }
    const ai = getAI();
    if (ai) {
      const prompt = `You are a strict trivia judge for "Jest Guessing".
Commonality Trait: "${trait}"

CRITICAL: Provide ONE recognizable pop culture character who CANONICALLY and UNDENIABLY possesses this exact trait: "${trait}".
EXCLUSION LIST - DO NOT RETURN ANY OF THESE CHARACTERS:
${Array.from(excludeSet).slice(0, 50).join(", ")}

Return ONLY a JSON object:
{
  "name": "Full Character Name",
  "origin": "Franchise or Origin",
  "wikiSlug": "Wikipedia_Slug",
  "hint": "Subtle clue (max 10 words)",
  "traitVerification": "Factual explanation of how they satisfy the trait"
}`;
      const text = await callGeminiSafe(ai, prompt);
      if (text) {
        try {
          const cleaned = text.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.name && !excludeSet.has(parsed.name.toLowerCase())) {
            return res.json({
              character: {
                name: parsed.name,
                origin: parsed.origin || "Pop Culture",
                wikiSlug: parsed.wikiSlug || parsed.name.replace(/\s+/g, "_"),
                hint: parsed.hint || `Matches ${trait}`,
                traitVerification: parsed.traitVerification,
                imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(parsed.wikiSlug || parsed.name)}?width=400`
              }
            });
          }
        } catch {
        }
      }
    }
    const fallbackCand = topCharactersList.find(
      (c) => !excludeSet.has(c.name.toLowerCase())
    );
    if (fallbackCand) {
      return res.json({
        character: {
          name: fallbackCand.name,
          origin: fallbackCand.origin,
          wikiSlug: fallbackCand.name.replace(/\s+/g, "_"),
          hint: `Famous figure from ${fallbackCand.origin}`,
          imageUrl: `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(fallbackCand.name.replace(/\s+/g, "_"))}?width=400`
        }
      });
    }
    res.status(404).json({ error: "No more unique characters found for this trait" });
  } catch (err) {
    console.error("Error in /api/reroll-character:", err);
    res.status(500).json({ error: "Failed to reroll character" });
  }
});
app.post("/api/solo-ask", async (req, res) => {
  try {
    const { question = "", character, themeName = "" } = req.body || {};
    if (!question || !character || !character.name) {
      return res.status(400).json({ error: "Missing question or character" });
    }
    const guessCheck = checkCharacterGuess(question, character);
    if (guessCheck.isCorrect) {
      return res.json({
        verdict: "YES",
        answerText: "By the Royal Crown\u2014YES! You have unmasked your secret identity!",
        isDirectGuess: true,
        guessedCharacterMatch: true
      });
    }
    const ai = getAI();
    if (ai) {
      const prompt = `You are the Court Oracle in the medieval parlor game "Jest Guessing".
The player is trying to deduce their secret identity by asking Yes/No questions.
Secret Character: "${character.name}"
Origin / Franchise: "${character.origin || "Pop Culture"}"
Known Fact: "${character.hint || ""} ${character.traitVerification || ""}"
Player's Question: "${question}"

INSTRUCTIONS:
1. Answer the player's question truthfully about "${character.name}".
2. NEVER reveal "${character.name}" or their specific franchise title in your answerText!
3. Choose "verdict" from: "YES", "NO", or "PARTIAL".
4. Write "answerText" as a concise, atmospheric 1-sentence response (max 15 words) starting with "Aye!", "Nay!", or "Partly so\u2014".

Return ONLY a JSON object:
{
  "verdict": "YES",
  "answerText": "Aye! Your secret identity is indeed human."
}`;
      const text = await callGeminiSafe(ai, prompt);
      if (text) {
        try {
          const cleaned = text.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.verdict && parsed.answerText) {
            return res.json({
              verdict: ["YES", "NO", "PARTIAL"].includes(parsed.verdict) ? parsed.verdict : "NO",
              answerText: parsed.answerText
            });
          }
        } catch {
        }
      }
    }
    const fallbackEval = evaluateSoloQuestion(question, character, themeName);
    return res.json(fallbackEval);
  } catch (err) {
    console.error("Error in /api/solo-ask:", err);
    res.status(500).json({ error: "Failed to evaluate question" });
  }
});
app.get("/api/fresh-themes", async (_req, res) => {
  try {
    const theme = await generateRoundTheme(4);
    res.json([theme]);
  } catch (err) {
    console.error("Error in /api/fresh-themes:", err);
    res.status(500).json({ error: "Failed to generate theme" });
  }
});
app.get("/api/commonalities", (_req, res) => {
  res.json(commonalitiesList);
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    commonalitiesCount: commonalitiesList.length,
    knownCharactersCount: topCharactersList.length
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
export {
  server_default as default
};
