function capitalizeWords(str) {
    var words = str.split(' ');
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].substring(0, 1).toUpperCase() + words[i].substring(1);
    }
    return words.join(' ');
}

var education_order = ["some high school", "high school", "some college", "bachelor's degree", "master's degree", "associate's degree"];
var gender_order = ["female", "male"];
var race_order = ["group A", "group B", "group C", "group D", "group E"]

function generateName(level, name) {
    name = name.substring(0, 1).toUpperCase() + name.substring(1);
    return `${name} score in ${level} level`
}