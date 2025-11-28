import { useState } from 'react';
import { toast } from 'sonner';

export const useFarmerPublish = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
    images: [] as File[],
  });

  const openPublishDialog = () => {
    setIsOpen(true);
  };

  const closePublishDialog = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      price: '',
      description: '',
      images: [],
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      toast.error('请填写完整的商品信息');
      return;
    }

    // 模拟API调用
    toast.loading('正在发布商品...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('商品发布成功！');
      closePublishDialog();
    }, 1500);
  };

  return {
    isOpen,
    formData,
    setFormData,
    openPublishDialog,
    closePublishDialog,
    handleSubmit,
  };
};
