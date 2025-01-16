import api, { API_URL } from '../utils/api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const DisplayDraw = () => {
    const [drawData, setDrawData] = useState([])
    const fetchAllData = async () => {
        try {
            const res = await api.get('/api/svg-store')
            if (res?.status === 200) {
                setDrawData(res?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    const deleteFunction = async (drawId) => {
        try {
            if (confirm("Are you shower to delete this record")) {
                const res = await api.delete(`/api/svg-store/${drawId}`)
                if (res?.status === 200) {
                    console.log(res?.data?.data)
                    alert(res?.data?.message)
                    fetchAllData()
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div class="p-4 bg-gray-100 min-h-screen">
                <div class="flex justify-end mb-4">
                    <Link href="/addDraw">
                        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Add
                        </button>
                    </Link>
                </div>

                <div class="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table class="min-w-full border border-gray-200">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Image</th>
                                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Edit</th>
                                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(drawData) && drawData?.length > 0 ?
                                drawData?.map((item, index) => (
                                    <>
                                        <tr>
                                            <td class="px-4 py-2 text-gray-700 border-b">{index + 1}</td>
                                            <td class="px-4 py-2 text-gray-700 border-b">
                                                <img src={`${API_URL}/images/${item?.img}`} alt="Placeholder" class="w-12 h-12 rounded-full" />
                                            </td>
                                            <td class="px-4 py-2 text-gray-700 border-b">
                                                <Link href={`/addDraw?drawId=${item?._id}`}>
                                                    <button class="text-blue-500 hover:text-blue-700">
                                                        <i class="fas fa-edit"></i>
                                                        Edit
                                                    </button>
                                                </Link>
                                            </td>
                                            <td class="px-4 py-2 text-gray-700 border-b">
                                                <button class="text-red-500 hover:text-red-700"
                                                    onClick={() => {
                                                        deleteFunction(item?._id)
                                                    }}
                                                >
                                                    <i class="fas fa-trash"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                ))
                                : <tr className='text-center'>
                                    <td colSpan={4} className='px-2 py-2'>
                                        No data found!
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default DisplayDraw