const Test: React.FC = () => {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <div className="flex w-60 flex-row gap-0">
                <div className="flex w-40 justify-center rounded-tl-3xl bg-slate-700 p-3 ring-gray-900/5">
                    <p className="text-white">Info</p>
                </div>
                <div className="flex w-40 justify-center rounded-tr-md bg-slate-200 p-3 ring-gray-900/5">
                    <p>Images</p>
                </div>
            </div>

            <div className="w-80 rounded-b-lg rounded-tr-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/5">
                <div className="flex w-full flex-col gap-12">
                    <div className="w-full">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"> Title </label>
                        <input
                            className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-pink-300 focus:bg-white focus:outline-none"
                            type="text"
                            placeholder="Wishlist Item"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"> Price </label>
                        <input
                            className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-pink-300 focus:bg-white focus:outline-none"
                            id="grid-last-name"
                            type="text"
                            placeholder="$0.00"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"> Product Link </label>
                        <input
                            className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-pink-300 focus:bg-white focus:outline-none"
                            id="grid-last-name"
                            type="text"
                            placeholder="website.com/product"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"> Notes </label>
                        <textarea
                            className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-pink-300 focus:bg-white focus:outline-none"
                            id="grid-last-name"
                            rows={4}
                        ></textarea>
                    </div>

                    <div className="flex w-full flex-row justify-end gap-4">
                        <button className="rounded border border-pink-300 bg-white py-2 px-4 font-bold text-pink-300 hover:text-pink-400">Cancel</button>
                        <button className="rounded bg-pink-300 py-2 px-4 font-bold text-white hover:bg-pink-400">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;
