async function register() {
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST'
    });
    const data = await response.json();
    localStorage.setItem('address', data.address); // Store address in local storage
    localStorage.setItem('privateKey', data.privateKey); // Store private key in local storage
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('profileForm').style.display = 'block';
}

async function setProfile() {
    const username = document.getElementById('username').value;
    const profilePicture = document.getElementById('profilePicture').value;
    const address = localStorage.getItem('address');
    const privateKey = localStorage.getItem('privateKey');
    const response = await fetch('http://localhost:3000/setProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, profilePicture, address, privateKey })
    });
    const data = await response.json();
    alert(data.message);
}

// Fetch posts when the page loads
fetchPosts();
