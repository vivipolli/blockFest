import { NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY

async function uploadBufferToPinata(buffer, fileName) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
  const data = new FormData()
  data.append('file', buffer, fileName)

  const response = await axios.post(url, data, {
    maxBodyLength: Infinity,
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
      ...data.getHeaders(),
    },
  })

  return response.data
}

async function uploadJSONToPinata(jsonData) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'

  const response = await axios.post(url, jsonData, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  })

  return response.data
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image')
    const eventData = formData.get('eventData')

    if (!image || !eventData) {
      return NextResponse.json(
        { error: 'Missing image or event data' },
        { status: 400 }
      )
    }

    const eventDetails = JSON.parse(eventData)

    const fileId = uuidv4()
    const fileExtension = image.name.split('.').pop()
    const fileName = `${fileId}.${fileExtension}`

    // Convert image to buffer directly without writing to disk
    const buffer = Buffer.from(await image.arrayBuffer())

    // Upload buffer directly to Pinata
    const imageUploadResponse = await uploadBufferToPinata(buffer, fileName)
    const imageIpfsHash = imageUploadResponse.IpfsHash
    const imageUrl = `ipfs://${imageIpfsHash}`

    const nftMetadata = {
      name: eventDetails.title,
      description: eventDetails.description,
      image: imageUrl,
      attributes: [
        { trait_type: 'Event Date', value: eventDetails.date },
        { trait_type: 'Location', value: eventDetails.location },
        { trait_type: 'Category', value: eventDetails.category },
        { trait_type: 'Organizer', value: eventDetails.organizer.name },
        { trait_type: 'Price', value: eventDetails.price.toString() },
        { trait_type: 'Ticket Type', value: 'Standard' },
      ],
      properties: {
        eventId: eventDetails.id.toString(),
        eventStatus: eventDetails.status,
        isPaid: eventDetails.isPaid,
        createdAt: new Date().toISOString(),
      },
    }

    const metadataUploadResponse = await uploadJSONToPinata(nftMetadata)
    const metadataIpfsHash = metadataUploadResponse.IpfsHash
    const metadataUrl = `ipfs://${metadataIpfsHash}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      metadataUrl: metadataUrl,
      imageIpfsHash: imageIpfsHash,
      metadataIpfsHash: metadataIpfsHash,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error processing upload', details: error.message },
      { status: 500 }
    )
  }
}
