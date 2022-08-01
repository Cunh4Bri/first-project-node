const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())


const orders = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({ message:"user not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const methodUrl = (request,response, next) => {

    console.log(`Method used: ${request.method} and the URL:${ request.path} `)

    next()

}


app.get('/orders', methodUrl,(request, response) => {

    return response.json(orders)
})

app.post('/orders', methodUrl, (request, response) => {
    const { command, clientName, price } = request.body

    const order = { id: uuid.v4(), command, clientName, price, status:"Em preparação" }

    orders.push(order)

    return response.status(201).json(order)
})

app.put('/orders/:id', checkUserId, methodUrl, (request, response) => {
    
    const { command, clientName, price  } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, command, clientName, price, status:"Em preparação" }

    

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkUserId, methodUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.get('/orders/:id', checkUserId, methodUrl,(request, response) => {

    const index = request.orderIndex


    return response.json(orders[index])
})

app.patch('/orders/:id', checkUserId, methodUrl, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const {command, clientName, price } = orders[index]
    
    const stats = {id, command, clientName, price, status: "Pronto" }

    orders[index] = stats

    return response.json(stats)
    
})







app.listen(3000, () =>{
    console.log(`🚀Sever started on port ${port}`)
})
