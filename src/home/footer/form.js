const Form = () => {
    return (
        <div className='w-full h-fit'>
            <span className="font-bold text-2xl">React out and Say Hi!</span>
            <form className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-bold">Your Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Full Name"
                        className="input hover:bg-purple-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-bold">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        className="input hover:bg-purple-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-bold">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        placeholder="Message Subject"
                        className="input hover:bg-purple-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-bold">Message</label>
                    <textarea
                        id="message"
                        placeholder="Your Message"
                        rows={4}
                        className="input hover:bg-purple-300 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="input bg-black text-white hover:bg-purple-300 hover:text-black font-bold mt-2 cursor-pointer"
                >
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default Form;