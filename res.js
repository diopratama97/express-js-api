'use strict';

exports.ok = (datas,res) => {
    let data = {
        'status': 200,
        'data': datas
    };
     res.json(data);
     res.end();
}

exports.err = (datas,res) =>{
    let data = {
        'status': 500,
        'message': 'Internal Server Error',
        'error': datas
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