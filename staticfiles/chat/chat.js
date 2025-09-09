const websocketProtocol = window.location.protocol === "https:" ? "wss" : "ws"
const endpoint = `${websocketProtocol}://${window.location.host}/ws/chat/{{ room_name }}/`
const socket = new WebSocket(endpoint)

socket.onopen = (e) => {
    console.log("WebSocket connection established.")
}

socket.onclose = (e) => {
    console.log("WebSocket connection closed.")
}

// Auto-resize textarea
const messageInput = document.getElementById("message-input")
messageInput.addEventListener("input", function() {
    this.style.height = "auto"
    this.style.height = Math.min(this.scrollHeight, 120) + "px"
})

// Send button functionality
document.getElementById("send-button").addEventListener("click", (event) => {
    event.preventDefault()

    const inputField = document.getElementById("message-input")
    const message = inputField.value.trim()

    if (message) {
        socket.send(
            JSON.stringify({
                message: message,
                sender: "{{ user }}", // Django will replace this
                room: "{{ room_name }}", // Django will replace this
            }),
        )

        inputField.value = "" // clear the input box
        inputField.style.height = "auto" // reset height
    }
})

// Send message on Enter key (but allow Shift+Enter for new lines)
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        document.getElementById("send-button").click()
    }
})

socket.addEventListener("message", (event) => {
    const messageData = JSON.parse(event.data)["message"]
    console.log(messageData)
    var sender = messageData["sender"]
    var message = messageData
    addMessageToChat(message, sender === "{{ user }}")
})

function addMessageToChat(message, isOwn = false) {
    const messagesArea = document.getElementById("messages")
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isOwn ? "own" : ""}`

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageDiv.innerHTML = `
        <div class="message-bubble">
            <div class="message-content">${message}</div>
        </div>
        <div class="message-info">
            ${isOwn ? `<span class="timestamp">${timeString}</span><span class="username">You</span>` : `<span class="username">User</span><span class="timestamp">${timeString}</span>`}
        </div>
    `

  messagesArea.appendChild(messageDiv)
  messagesArea.scrollTop = messagesArea.scrollHeight
}