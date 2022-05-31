import React from 'react'

export const ModalChain = () => {
    return (
        <>  
            <div className='w-11/12 sm:w-2/3 md:w-7/12 h-3/4 md:h-4/6 fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 z-20 bg-white rounded text-black overflow-auto'>
                <div className='w-full h-full relative py-6 px-6'>
                    <div className='px-4 w-full h-full flex flex-col'>
                        <h2 className='mb-12 font-semibold text-2xl text-center'>Incorrect network</h2>
                        <p className='mb-8 text-center'>You are on an <span className='font-semibold'>incorrect chain</span>, please change to Mumbai chain.</p>
                        <p className='text-center'>If you do not have Mumbai chain imported, do it <a className='text-blue-400' href='https://chainlist.org/chain/80001' target='_blank' rel="noreferrer">here</a>.</p>
                    </div>
                </div>
            </div>
            <div className='bg-black/50 fixed top-0 left-0 right-0 min-h-screen z-10'></div>
        </>
    )
}
