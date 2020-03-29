
const time2cn = time => {
    if(!time){
		return '';
    }
    if (time instanceof Date) {
        return inWords(distance(time));
    } else if (typeof time === "string") {
        return inWords(distance(parse(time)));
    } else if (typeof time === "number") {
        return inWords(distance(new Date(time)))
    }
};

const inWords = (date) => {
    var prefix = strings.prefixAgo;
    var suffix = strings.suffixAgo;

    var seconds = Math.abs(date) / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    function substitute (stringOrFunction, number) {
        var string = stringOrFunction;
        var value = (strings.numbers && strings.numbers[number]) || number;
        return string.replace(/%d/i, value);
    }

    var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute(strings.minute, 1) ||
                minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute(strings.hour, 1) ||
                hours < 24 && substitute(strings.hours, Math.round(hours)) ||
                hours < 48 && substitute(strings.day, 1) ||
                // hours < 36 && substitute(strings.day2, 1) ||
                days < 30 && substitute(strings.days, Math.floor(days)) ||
                days < 60 && substitute(strings.month, 1) ||
                days < 365 && substitute(strings.months, Math.floor(days / 30)) ||
                years < 2 && substitute(strings.year, 1) ||
                // years < 3 && substitute(strings.year2, 1) ||
                substitute(strings.years, Math.floor(years));
    if(words == strings.seconds) return words;
    else return [prefix, words, suffix].join("").toString().trim();
};

const strings = {
    prefixAgo: null,
    suffixAgo: "前",
    seconds: "刚刚",
    minute: "1分钟",
    minutes: "%d分钟",
    hour: "1小时",
    hours: "%d小时",
    day: "1天",
    // day2: "前天",
    days: "%d天",
    month: "1个月",
    months: "%d个月",
    year: "1年",
    // year2: "前年",
    years: "%d年",
    numbers: []
}

const distance = date => {
    return (new Date().getTime() - date.getTime());
};

const parse = str=> {
    if (!str) return;
    var s = str.trim();
    s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
    s = s.replace(/-/,"/").replace(/-/,"/");
    s = s.replace(/T/," ").replace(/Z/," UTC");
    s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
    return new Date(s);
}

module.exports = {
    time2cn: time2cn
}