/**
 * Mock client-side session and user storage — assignment demo only.
 * NOT real authentication or secure storage.
 */

var STORAGE_USERS_KEY = 'av1_users';
var STORAGE_SESSION_KEY = 'av1_session';
var STORAGE_REQUESTS_KEY = 'av1_service_requests';

function getStoredUsers() {
  try {
    var raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function addStoredUser(user) {
  var users = getStoredUsers();
  var emailAlreadyExists = users.some(function (storedUser) {
    return storedUser.email.toLowerCase() === user.email.toLowerCase();
  });
  if (emailAlreadyExists) return false;
  users.push({
    email: user.email,
    password: user.password,
    fullName: user.fullName
  });
  saveUsers(users);
  return true;
}

function findUserByEmail(email) {
  var emailLower = email.toLowerCase();
  return getStoredUsers().find(function (storedUser) {
    return storedUser.email.toLowerCase() === emailLower;
  });
}

function updateUserPassword(email, newPassword) {
  var users = getStoredUsers();
  var emailLower = email.toLowerCase();
  var wasUpdated = false;
  users = users.map(function (storedUser) {
    if (storedUser.email.toLowerCase() === emailLower) {
      wasUpdated = true;
      return {
        email: storedUser.email,
        password: newPassword,
        fullName: storedUser.fullName
      };
    }
    return storedUser;
  });
  if (wasUpdated) saveUsers(users);
  return wasUpdated;
}

function getSession() {
  try {
    var raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setSession(sessionUser) {
  sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}

function isLoggedIn() {
  return getSession() !== null;
}

function loadServiceRequests(email) {
  try {
    var allData = JSON.parse(localStorage.getItem(STORAGE_REQUESTS_KEY) || '{}');
    var key = (email || '').toLowerCase();
    return Array.isArray(allData[key]) ? allData[key] : [];
  } catch (error) {
    return [];
  }
}

function saveServiceRequests(email, rows) {
  try {
    var allData = JSON.parse(localStorage.getItem(STORAGE_REQUESTS_KEY) || '{}');
    var key = (email || '').toLowerCase();
    allData[key] = rows;
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(allData));
  } catch (error) {
    /* mock only */
  }
}
