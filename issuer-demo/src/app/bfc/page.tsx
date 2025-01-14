import Image from "next/image";
const BFCPage = () => {
  return (
    <div className="page-container flex flex-col items-center justify-center">
      <Image
        src="/images/Ethereum_logo_translucent.svg"
        alt="Teamwork Vector Illustration Style"
        width={200}
        height={200}
        style={{ marginTop: "2rem" }}
      />
      <h1 className="text-2xl font-bold text-center font-serif">
        Publishing BFC to the blockchain...
      </h1>
      <h2 className="text-2xl font-medium text-center italic tracking-wide">
        It is going to take a moment depending on network congestion!
      </h2>
    </div>
  );
};

export default BFCPage;
