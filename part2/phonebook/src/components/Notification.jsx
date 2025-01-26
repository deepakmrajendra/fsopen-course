const Notification = ({ message, messageType }) => {

    // console.log(message)
    // console.log(messageType)

    if (message === null) {
      return null
    }

    const noticeStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
  
    const errorStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

    const style = messageType === 'error' ? errorStyle : noticeStyle
  
    return (
      <div style={style}>
        {message}
      </div>
    )

  }
  
  export default Notification