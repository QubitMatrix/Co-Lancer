function validate_name(name)
{
    console.log("name: "+name);
    const name_pattern = /^[a-zA-Z ]+$/; //regex to accept one or more letters or space
    return name_pattern.test(name) && name.trim().length>0;
}

function validate_username(username)
{
    console.log("username: "+username);
    const username_pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/; //regex to accept only usernames starting with a letter and consisting of letters, numbers and _
    return username_pattern.test(username);
}

function validate_email(email)
{
    console.log("Email "+email);
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex to accept for email address
    return email_pattern.test(email);
}

function validate_password(password)
{
    console.log("Password: "+password);
    const password_pattern = /^[a-zA-Z0-9@#$!%&]{8,30}$/; //regex to validate password for min 8 to max 30 letters, digits or special symbols
    return password_pattern.test(password);
}

function validate_letters(field, length)
{
    console.log("field: "+field)
    const pattern = new RegExp(`^[a-zA-Z -]{1,${length}}$`); //regex to check if max length of letters only
    console.log(pattern);
    return pattern.test(field);
}

function validate_alphanumeric(field, length)
{
    console.log("field: "+field)
    const alnum_pattern = new RegExp(`^[a-zA-Z0-9 -]{1,${length}}$`); //regex to validate max 30 alphanumerics
    console.log(alnum_pattern);
    return alnum_pattern.test(field);
}

function validate_year(year)
{
    console.log("year: "+year)
    const year_pattern = /^[0-9]{4}$/; //validate 4 digits year
    console.log(year_pattern);
    return year_pattern.test(year);
}

function validate_url(url)
{
    console.log("url: "+url);
    const url_pattern = /^[a-zA-Z0-9: -_.//]+$/;
    console.log(url_pattern);
    return url_pattern.test(url);
}

module.exports = {validate_name, validate_username, validate_email, validate_password, validate_letters, validate_alphanumeric, validate_year, validate_url};