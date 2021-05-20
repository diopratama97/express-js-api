'use strict';

exports.ok = function (values,res) {
    let data = {
        'status': 200,
        'values': values
    };
     res.json(data);
     res.end();
}

//respons nested json object
exports.nested = (values,res) => {
    //lakukan akumulasi
    const hasil = values.reduce((akumulasi, item)=>{
        //tentukan key grup
        if (akumulasi[item.nama]) {
            //buat variable grup
            const group = akumulasi[item.nama]
            //cek jika isi array adalah matakuliah
            if (Array.isArray(group.matakuliah)) {
                group.matakuliah.push(item.matakuliah);
            }else{
                group.matakuliah = [group.matakuliah, item.matakuliah];
            }
        }else{
            akumulasi[item.nama]=item;
        }
        return akumulasi;
    },{});

    let data = {
        'status':200,
        'values': hasil
    };
     res.json(data);
     res.end();
}