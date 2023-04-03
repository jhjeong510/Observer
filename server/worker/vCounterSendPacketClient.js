const net = require('net');
const client = new net.Socket();

exports.connectPacketSenderForVCounterClient = async () => {
	connectTcp(process.env.VCOUNTER_IP, process.env.VCOUNTER_PORT);
}

const connectTcp = async (ip, port) => {
	const packet = Buffer.from([0xF6, 0xF7, 0xF8, 0xF9, 0x23, 0x9C, 0xFF, 0xFA]);

	client.connect(port, ip, () => {
		console.log('Connected V-Counter');

		client.write(packet, (err) => {
			if (err) {
				console.error('sending packet err', err);
			} else {
				console.log('success');
			}

			client.destroy();
		});
	});

	client.on('error', (err) => {
		console.error('connection error', err);
	});
}