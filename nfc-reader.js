const { NFC } = require('nfc-pcsc');
const axios = require('axios');
const open = require('open').default; // ✅ fixed import

const API_URL = 'http://localhost:3000/api/admin/nfc-read';

const nfc = new NFC();

nfc.on('reader', (reader) => {
  console.log(`✅ Reader detected: ${reader.name}`);

  reader.on('card', async (card) => {
    const nfcId = card.uid;
    console.log(`🎉 Card detected with UID: ${nfcId}`);

    try {
      const res = await axios.post(API_URL, { nfcId });

      if (res.status === 200 && res.data.patient) {
        const patient = res.data.patient;
        const profileUrl = `http://localhost:3000/admin/patients/${patient.id}`;

        console.log('✅ Patient found:', patient.firstName, patient.lastName);
        console.log('🔗 Opening profile:', profileUrl);

        await open(profileUrl);
      } else {
        console.warn('⚠️ Patient not found for this tag.');
      }
    } catch (error) {
      console.error('❌ Failed to handle NFC tag:', error.message);
    }
  });

  reader.on('error', (err) => {
    console.error('❌ Reader error:', err);
  });

  reader.on('end', () => {
    console.log(`❗ Reader disconnected: ${reader.name}`);
  });
});

nfc.on('error', (err) => {
  console.error('❌ NFC error:', err);
});
