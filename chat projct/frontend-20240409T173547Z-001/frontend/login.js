const web3 = new Web3(window.ethereum);

document.addEventListener('DOMContentLoaded', async () => {
    const connectWalletButton = document.getElementById('connectWallet');
    const loginButton = document.getElementById('login');
    const walletAddressDisplay = document.getElementById('walletAddress');
    const loginSignupContainer = document.getElementById('loginSignupContainer');

    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask or another Ethereum wallet provider not detected. Please install MetaMask or use a compatible Ethereum wallet provider.');
        return;
    }

    connectWalletButton.addEventListener('click', async () => {
        try {
            // Requesting access to the user's Ethereum accounts
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            walletAddressDisplay.textContent = `Connected Wallet: ${walletAddress}`;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please make sure MetaMask is properly installed and configured.');
        }
    });

    loginButton.addEventListener('click', async () => {
        try {
            // Get connected wallet address
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            const walletAddress = accounts[0]; // Assuming only one account is connected

            // Contract address and ABI
            const userRegistryAddress = '0xea44bef31e2f040a3e877723cc2569303b9284eb'; // Replace with actual address
            const userRegistryABI = [{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"getAddressByUsername","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUsername","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"isUsernameAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"isUserSignedUp","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

            // Create contract instance
            const userRegistryContract = new web3.eth.Contract(userRegistryABI, userRegistryAddress);

            // Check if user is signed up
            const isSignedUp = await userRegistryContract.methods.isUserSignedUp(walletAddress).call();

            if (isSignedUp) {
                alert('Login successful!');
                // Redirect to the dashboard page
                window.location.href = 'dashboard.html';
                // Hide login and signup buttons
                loginSignupContainer.style.display = 'none';
            } else {
                alert('User not found. Please sign up first.');
                // Redirect to the sign-up page
                window.location.href = 'signup.html';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
