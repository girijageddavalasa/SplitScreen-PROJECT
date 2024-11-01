const socket = io(); // Initialize Socket.IO
const video = document.getElementById('video');

// Event listener for the "Join" button
document.getElementById('join').addEventListener('click', function() {
    const secretCode = document.getElementById('code').value;

    // Reset video classes before adding a new one
    video.classList.remove('left', 'right'); // Remove any existing classes

    if (secretCode === 'left') {
        video.classList.add('left'); // Add left class to clip video to left half
        video.currentTime = 0; // Start from the beginning
        video.play(); // Play the video
        syncVideoTime(video); // Sync video time
    } else if (secretCode === 'right') {
        video.classList.add('right'); // Add right class to clip video to right half
        video.currentTime = 0; // Start from the beginning
        video.play(); // Play the video
        syncVideoTime(video); // Sync video time
    } else {
        alert('Invalid code. Please enter "left" or "right".'); // Alert for invalid input
    }
});

// Function to synchronize video time
function syncVideoTime(video) {
    video.addEventListener('timeupdate', () => {
        // Emit the current time of the video to the server
        socket.emit('syncTime', { time: video.currentTime, side: video.classList.contains('left') ? 'left' : 'right' });
    });

    // Listen for time sync from other clients
    socket.on('syncTime', ({ time, side }) => {
        if ((side === 'left' && video.classList.contains('left')) || 
            (side === 'right' && video.classList.contains('right'))) {
            video.currentTime = time; // Sync the video time if on the correct side
        }
    });
}

// Pause button functionality
document.getElementById('pause').addEventListener('click', function() {
    video.pause(); // Pause the video
    socket.emit('pauseVideo'); // Notify other clients to pause
});

// Play button functionality
document.getElementById('play').addEventListener('click', function() {
    video.play(); // Play the video
    socket.emit('playVideo'); // Notify other clients to play
});

// Listen for pause event from other clients
socket.on('pauseVideo', () => {
    video.pause(); // Pause the video
});

// Listen for play event from other clients
socket.on('playVideo', () => {
    video.play(); // Play the video
});
